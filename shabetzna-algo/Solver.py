from datetime import datetime
from ortools.sat.python import cp_model


def calculate_optimal_schedule(
        user_weights: dict,
        shift_difficulties: list,
        constraints: list,
        users_per_shift: int,
) -> list:
    """Calculates the optimal shift allocation using Google OR-Tools CP-SAT solver.

    - Optimizes for fairness (equal weight distribution) and constraint preferences.
    - Softly prevents double-booking and consecutive shifts: allows them up to 2
      shifts ONLY if the schedule is mathematically impossible otherwise.
    """
    model = cp_model.CpModel()


    # Tunable Parameters
    SCALE = 100
    FAIRNESS_MULTIPLIER = 1000
    # Massive penalty to ensure the solver only breaks the rules as a last resort
    RULE_VIOLATION_PENALTY = 10_000_000

    # Map JSON constraint strings to integer preferences
    CONSTRAINT_MAP = {"CANNOT": -2, "PREFER_NOT": -1, "PREFER": 1, "MUST": 2}

    # Multipliers applied to shift difficulty based on user preference
    PREF_MULTIPLIERS = {
        -2: 0.0,
        -1: 1.6,
        0: 1.2,
        1: 1.0,
        2: 1.0,
    }

    users = list(user_weights.keys())

    # Map shift data into lookup dictionaries
    shifts_by_key = {
        (s["date"], s["shift_type"]): s["calculated_weight"]
        for s in shift_difficulties
    }
    shift_keys = list(shifts_by_key.keys())

    unique_dates = sorted(list(set(d for d, _ in shift_keys)))
    date_to_keys = {
        d: [k for k in shift_keys if k[0] == d] for d in unique_dates
    }

    # Flatten constraints: (userId, date, shiftType) -> integer preference
    user_prefs = {}
    for c in constraints:
        c_user = c["userId"]
        c_date = c["date"]
        c_pref = CONSTRAINT_MAP.get(c["type"], 0)
        c_stype = c.get("shiftType", None)

        if c_stype:
            user_prefs[(c_user, c_date, c_stype)] = c_pref
        else:
            for d, stype in shift_keys:
                if d == c_date:
                    user_prefs[(c_user, d, stype)] = c_pref

    # ----------------------------------------
    # 1. DECISION VARIABLES
    # ----------------------------------------
    x = {}
    for u in users:
        for d, stype in shift_keys:
            x[(u, d, stype)] = model.new_bool_var(f"x_{u}_{d}_{stype}")

    # Track how many times a fallback rule is triggered
    penalty_vars = []

    # ----------------------------------------
    # 2. CONSTRAINTS
    # ----------------------------------------

    # A. Shift Coverage: Exactly 'users_per_shift' per (date, shift_type)
    for d, stype in shift_keys:
        model.add(sum(x[(u, d, stype)] for u in users) == users_per_shift)

    # B. Worker-Specific Constraints
    for u in users:
        # 1. Hard Constraints (MUST / CANNOT)
        for d, stype in shift_keys:
            pref = user_prefs.get((u, d, stype), 0)
            if pref == -2:
                model.add(x[(u, d, stype)] == 0)
            elif pref == 2:
                model.add(x[(u, d, stype)] == 1)

            # 2. Soft Same-Day Double Booking
            for d in unique_dates:
                day_keys = date_to_keys[d]
                shifts_today = sum(x[(u, date, stype)] for date, stype in day_keys)
                # Absolute limit: Never exceed 3 shifts in a single day
                model.add(shifts_today <= 3)
                # Soft limit: Penalty triggers if shifts_today > 1
                same_day_penalty = model.new_bool_var(f"same_day_pen_{u}_{d}")
                model.add(shifts_today <= 1 + same_day_penalty)
                penalty_vars.append(same_day_penalty)


        # 3. Soft Conditional Next-Day Rest Rule
        for i in range(len(unique_dates) - 1):
            d1_str = unique_dates[i]
            d2_str = unique_dates[i + 1]

            d1_dt = datetime.strptime(d1_str, "%Y-%m-%d")
            d2_dt = datetime.strptime(d2_str, "%Y-%m-%d")

            # Only enforce for strictly consecutive calendar days
            if (d2_dt - d1_dt).days == 1:
                d1_keys = date_to_keys[d1_str]
                d2_keys = date_to_keys[d2_str]

                for d1_date, d1_stype in d1_keys:
                    # Target: Block Day 2 shifts UNLESS Day 1 shift was "DAY"
                    if d1_stype.upper() != "DAY":
                        for d2_date, d2_stype in d2_keys:
                            consec_penalty = model.new_bool_var(f"consec_pen_{u}_{d1_date}_{d2_date}")
                            model.add(
                                x[(u, d1_date, d1_stype)]
                                + x[(u, d2_date, d2_stype)]
                                <= 1 + consec_penalty
                            )
                            penalty_vars.append(consec_penalty)

    # ----------------------------------------
    # 3. COST & FAIRNESS OBJECTIVE
    # ----------------------------------------
    future_weight_vars = {}
    total_cost_terms = []

    for u in users:
        worker_costs = []
        for d, stype in shift_keys:
            pref = user_prefs.get((u, d, stype), 0)
            mult = PREF_MULTIPLIERS.get(pref, 1.2)

            shift_w = shifts_by_key[(d, stype)]
            raw_cost = shift_w * mult
            int_cost = int(round(raw_cost * SCALE))

            term = x[(u, d, stype)] * int_cost
            worker_costs.append(term)
            total_cost_terms.append(term)

        current_w_scaled = int(round(user_weights[u] * SCALE))
        future_weight_vars[u] = model.new_int_var(
            0, 9999999, f"future_w_{u}"
        )
        model.add(
            future_weight_vars[u] == current_w_scaled + sum(worker_costs)
        )

    # Fairness Gap: Min-Max difference across user future weights
    max_w = model.new_int_var(0, 9999999, "max_w")
    min_w = model.new_int_var(0, 9999999, "min_w")
    model.add_max_equality(max_w, [future_weight_vars[u] for u in users])
    model.add_min_equality(min_w, [future_weight_vars[u] for u in users])

    gap = model.new_int_var(0, 9999999, "gap")
    model.add(gap == max_w - min_w)

    # Objective Function: Cost + Fairness + Penalties
    model.minimize(
        sum(total_cost_terms)
        + (FAIRNESS_MULTIPLIER * gap)
        + (RULE_VIOLATION_PENALTY * sum(penalty_vars))
    )

    # ----------------------------------------
    # 4. SOLVE & FORMAT OUTPUT
    # ----------------------------------------
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 30.0
    status = solver.Solve(model)

    final_schedule = []

    if status in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
        # Optional: Print out if rules had to be broken
        violations = sum(solver.Value(p) for p in penalty_vars)
        if violations > 0:
            print(f"INFO: Solver had to break {violations} rules to cover the schedule.")

        for d in unique_dates:
            for date, stype in date_to_keys[d]:
                for u in users:
                    if solver.Value(x[(u, date, stype)]) == 1:
                        final_schedule.append(
                            {"date": date, "userId": u, "shiftType": stype}
                        )
        return final_schedule
    else:
        print("WARNING: Solver could not find a feasible schedule")
        return []
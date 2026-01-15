from ortools.sat.python import cp_model


# Classes
class Worker:
    def __init__(self, wid, weight, preferences):
        self.id = wid
        self.weight = weight
        self.preferences = preferences


class Shift:
    def __init__(self, sid, required_workers, difficulty):
        self.id = sid
        self.required_workers = required_workers
        self.difficulty = difficulty


# Cost data
PREFERENCE_MULTIPLIER = {
    -2: None,   # absolutely can't (hard constraint)
    -1: 1.6,    # prefer not
     0: 1.2,    # neutral
     1: 1.0,    # prefer
     2: 0.0     # must (hard constraint)
}

FAIRNESS_WEIGHT = 10



# Assign new worker and provide weight
def assign_new_worker_weight(workers, new_worker):
    weights = sorted(w.weight for w in workers)

    if not weights:
        new_worker.weight = 0
        return

    weights.sort()
    n = len(weights)

    #  to get the 25%
    lower_half = weights[:n // 2]
    m = len(lower_half)
    median = lower_half[m // 2] if m % 2 == 1 else (lower_half[m // 2 - 1] + lower_half[m // 2]) / 2

    new_worker.weight = median



# Model
def build_model(workers, shifts, max_shifts_per_worker=None, no_consecutive=False):
    model = cp_model.CpModel()
    assign = {}

    # vars
    for w in workers:
        for s in shifts:
            assign[(w.id, s.id)] = model.NewBoolVar(f"a_{w.id}_{s.id}")

    # shifts
    for s in shifts:
        model.Add(sum(assign[(w.id, s.id)] for w in workers) == s.required_workers)

    # hard constraints
    for w in workers:
        for s in shifts:
            pref = w.preferences.get(s.id, 0)

            if pref == -2:   # absolutely can't
                model.Add(assign[(w.id, s.id)] == 0)

            if pref == 2:    # must have
                model.Add(assign[(w.id, s.id)] == 1)

    # if no consecutive shifts
    if no_consecutive:
        for w in workers:
            for i in range(len(shifts) - 1):
                s1 = shifts[i]
                s2 = shifts[i + 1]
                model.Add(assign[(w.id, s1.id)] + assign[(w.id, s2.id)] <= 1)

    # max shifts per worker
    if max_shifts_per_worker is not None:
        for w in workers:
            model.Add(
                sum(assign[(w.id, s.id)] for s in shifts) <= max_shifts_per_worker
            )

    return model, assign


def build_objective(model, assign, workers, shifts):
    objective_terms = []
    worker_future_weights = {}

    max_possible = 100000

    prefer_not_count = {}
    for w in workers:
        prefer_not_count[w.id] = sum(1 for s in shifts if w.preferences.get(s.id, 0) == -1)

    total_shifts = len(shifts)

    for w in workers:
        worker_future_weights[w.id] = model.NewIntVar(0, max_possible, f"future_weight_{w.id}")
        added_weight_terms = []

        for s in shifts:
            pref = w.preferences.get(s.id, 0)

            if pref == -2:  # skip absolute can't
                continue

            # alot "prefer not" = less weight
            if pref == -1:
                pct = prefer_not_count[w.id] / total_shifts  # 0 to 1
                multiplier = PREFERENCE_MULTIPLIER[-1] - pct * (PREFERENCE_MULTIPLIER[-1] - PREFERENCE_MULTIPLIER[0])
            else:
                multiplier = PREFERENCE_MULTIPLIER[pref]

            cost = int(s.difficulty * multiplier * 100)
            term = assign[(w.id, s.id)] * cost
            added_weight_terms.append(term)
            objective_terms.append(term)

        # future_weight = current_weight + assigned_weight
        model.Add(worker_future_weights[w.id] == int(w.weight * 100) + sum(added_weight_terms))

    # Fairness variables
    max_weight = model.NewIntVar(0, max_possible, "max_weight")
    min_weight = model.NewIntVar(0, max_possible, "min_weight")

    model.AddMaxEquality(max_weight, list(worker_future_weights.values()))
    model.AddMinEquality(min_weight, list(worker_future_weights.values()))

    weight_gap = model.NewIntVar(0, max_possible, "weight_gap")
    model.Add(weight_gap == max_weight - min_weight)

    # Final objective
    model.Minimize(sum(objective_terms) + 100 * FAIRNESS_WEIGHT * weight_gap)


# Solve
def solve_schedule(workers, shifts, max_shifts_per_worker=None, no_consecutive=False):
    model, assign = build_model(
        workers,
        shifts,
        max_shifts_per_worker=max_shifts_per_worker,
        no_consecutive=no_consecutive
    )

    build_objective(model, assign, workers, shifts)

    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 10
    solver.parameters.num_search_workers = 8

    status = solver.Solve(model)

    if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        raise Exception("❌ No solution found")

    schedule = {s.id: [] for s in shifts}

    for w in workers:
        for s in shifts:
            if solver.Value(assign[(w.id, s.id)]) == 1:
                schedule[s.id].append(w.id)

    return schedule


# Update weight
def update_worker_weights(workers, shifts, schedule):
    shift_map = {s.id: s for s in shifts}

    for s_id, assigned_workers in schedule.items():
        shift = shift_map[s_id]

        for w in workers:
            if w.id in assigned_workers:
                pref = w.preferences.get(s_id, 0)

                if pref == -2:
                    continue
                w.weight += shift.difficulty

def print_schedule(title, schedule):
    print(f"\n==== {title} ====")
    for sid, workers in schedule.items():
        print(f"Shift {sid}: {workers}")


def print_weights(workers):
    print("\nCurrent worker weights:")
    for w in workers:
        print(f"{w.id}: {w.weight:.2f}")

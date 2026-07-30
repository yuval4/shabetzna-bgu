import json
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from UserWeightCalculation import calculate_user_weights
from data import raw_input
from shiftDifficultyCalculation import calculate_allocation_difficulties

# Import the optimal schedule function
from Solver import calculate_optimal_schedule


if __name__ == "__main__":
    # ============================================================
    # 1. Parse Input
    # ============================================================
    input_data = json.loads(raw_input)

    user_ids = input_data.get("userIds", [])
    prev_shifts = input_data.get("prevShifts", [])

    # ============================================================
    # 2. Calculate Baseline Weights From Past Shifts
    # ============================================================
    n = len(user_ids) * 50

    last_n_shifts = prev_shifts[-n:][::-1] if n > 0 else []

    tuples_data = [
        (shift["assignedUserId"], shift["weight"])
        for shift in last_n_shifts
    ]

    user_results = calculate_user_weights(
        user_ids,
        tuples_data
    )

    # ============================================================
    # 3. Calculate BEFORE Differences
    # ============================================================

    print("\n--- INITIAL USER WEIGHTS ---")
    for uid, weight in user_results.items():
        print(f"User {uid:<2} | Weight: {weight:8.4f}")

    # ============================================================
    # 4. Calculate Shift Difficulties
    # ============================================================
    dates = input_data["shiftsDates"]
    shift_type = input_data["shiftsType"]

    shift_results = calculate_allocation_difficulties(
        dates,
        shift_type
    )
    print("--- FULL DAY (Defaults) ---")
    for res in shift_results:
        print(res)

    # ============================================================
    # 5. Solve for Optimal Schedule
    # ============================================================
    optimal_schedule = calculate_optimal_schedule(
        user_weights=user_results,
        shift_difficulties=shift_results,
        constraints=input_data.get("constraints", []),
        users_per_shift=input_data.get("usersPerShift", 2),
    )

    # ============================================================
    # 6. Print Optimal Schedule
    # ============================================================
    print("\n--- OPTIMAL SHIFT SCHEDULE ---")
    print(json.dumps(optimal_schedule, indent=2))

    # ============================================================
    # 7. Calculate Updated User Weights
    # ============================================================
    shift_weight_lookup = {
        (s["date"], s["shift_type"]): s["calculated_weight"]
        for s in shift_results
    }

    updated_user_weights = user_results.copy()

    for assignment in optimal_schedule:
        u_id = assignment["userId"]

        key = (
            assignment["date"],
            assignment["shiftType"]
        )

        shift_weight = shift_weight_lookup.get(key, 0.0)

        updated_user_weights[u_id] += shift_weight

    # ============================================================
    # 8. Print Updated User Weights
    # ============================================================
    print("\n--- UPDATED USER WEIGHTS (After New Shifts) ---")

    for uid, weight in updated_user_weights.items():
        added_weight = weight - user_results[uid]

        print(
            f"User {uid:<2} | "
            f"Old: {user_results[uid]:8.4f} | "
            f"+Added: {added_weight:6.2f} | "
            f"New Total: {weight:8.4f}"
        )


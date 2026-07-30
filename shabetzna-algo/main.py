from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from UserWeightCalculation import calculate_user_weights
from shiftDifficultyCalculation import calculate_allocation_difficulties
from Solver import calculate_optimal_schedule

# Initialize the API
app = FastAPI()

class AlgorithmData(BaseModel):
    userIds: List[str]  # Change to int if your IDs are integers
    shiftsDates: List[str]
    shiftsType: str
    constraints: List[Dict[str, Any]]
    usersPerShift: int
    prevShifts: List[Dict[str, Any]]


@app.post("/allocate")
def allocate_shifts(data: AlgorithmData):
    # Convert incoming NestJS payload to a dictionary
    input_data = data.dict()

    user_ids = input_data.get("userIds", [])
    prev_shifts = input_data.get("prevShifts", [])

    n = len(user_ids) * 50
    last_n_shifts = prev_shifts[-n:][::-1] if n > 0 else []

    tuples_data = [
        (shift["assignedUserId"], shift.get("weight", 0))  # Ensure weight exists or default to 0
        for shift in last_n_shifts
    ]

    user_results = calculate_user_weights(user_ids, tuples_data)

    dates = input_data["shiftsDates"]
    shift_type = input_data["shiftsType"]

    shift_results = calculate_allocation_difficulties(dates, shift_type)

    optimal_schedule = calculate_optimal_schedule(
        user_weights=user_results,
        shift_difficulties=shift_results,
        constraints=input_data.get("constraints", []),
        users_per_shift=input_data.get("usersPerShift", 1),  # Default matched to NestJS
    )

    shift_weight_lookup = {(s["date"], s["shift_type"]): s["calculated_weight"] for s in shift_results}
    updated_user_weights = user_results.copy()

    for assignment in optimal_schedule:
        u_id = assignment["userId"]
        key = (assignment["date"], assignment.get("shiftType", shift_type))
        updated_user_weights[u_id] += shift_weight_lookup.get(key, 0.0)

    # Return the optimal schedule as a JSON response to NestJS
    return optimal_schedule
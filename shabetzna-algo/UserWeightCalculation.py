import json
import math
import matplotlib.pyplot as plt

def calculate_user_weights(
    user_ids: list[int],
    tuples_data: list[tuple[int, float]]
) -> dict[int, float]:
    """
    Calculates current user weights based on decay and first-appearance median boost,
    ignoring any shift assigned to a user NOT present in user_ids.

    :param user_ids: List of requested user IDs
    :param tuples_data: List of tuples containing (assignedUserId, weight)
    :return: Dictionary mapping user_id -> calculated weight
    """

    arr_length = len(tuples_data)
    valid_user_ids = set(user_ids)
    running_user_totals = {}

    # Edge case: No previous shifts
    if arr_length == 0:
        return {user: 0.0 for user in user_ids}

    # Apply the decay algorithm (iterating in reverse order)
    for index, (user, weight) in reversed(list(enumerate(tuples_data))):

        # Ignore users that are not in the provided user_ids list
        if user not in valid_user_ids:
            continue

        x = index + 1

        # Calculate base decayed weight
        calculated_weight = weight * (2 ** (-4 * x / arr_length))
        boost_value = 0.0

        # First appearance boost logic
        if user not in running_user_totals:
            if running_user_totals:
                totals_pool = sorted(running_user_totals.values())
                n = len(totals_pool)

                # Lower median index
                lower_median_idx = (n // 2) if (n % 2 == 1) else ((n // 2) - 1)
                boost_value = totals_pool[lower_median_idx]

            calculated_weight += boost_value

        # Add to running total (Corrected placement for both new and existing users)
        running_user_totals[user] = (
            running_user_totals.get(user, 0.0) + calculated_weight
        )
    final_weights = {}

    for user in user_ids:
        if user in running_user_totals:
            final_weights[user] = running_user_totals[user]
        else:
            # Users that didn't appear at all get the current lower median boost
            boost_value = 0.0
            if running_user_totals:
                totals_pool = sorted(running_user_totals.values())
                n = len(totals_pool)
                lower_median_idx = (n // 2) if (n % 2 == 1) else ((n // 2) - 1)
                boost_value = totals_pool[lower_median_idx]

            final_weights[user] = boost_value



    return final_weights
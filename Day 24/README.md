# Day 24 statistics:

Input Downloaded: 12/24/2024, 12:00:07 AM\
Part 1 submitted: 12/24/2024, 12:28:09 AM (+00:28:01)\
Part 2 submitted: 12/24/2024, 3:00:24 AM (+02:32:15)

Part 1 Rank: 2321 (0 points)\
Part 2 Rank: 1651 (0 points)

_Note that as of 2024 Day 8, input download happens automatically when I first run the part 1 template file. I do this immediately after opening the puzzle for the first time._

Part 1 Run Time: 13ms\
Part 2 Find Possibilities Run Time: 58.2s
Part 2 Run Time: 149ms

_Code is run on a 2020 M1 Macbook Pro with 16GB of RAM_

Find possibilities collects potential swaps, narrowing each of the four swaps to a pool of: 8, 7, 3, and 4 swaps. It does this by finding incorrect digits after adding 0 + 2^n (where n is one of the digits). This resulted in four incorrect digits, so the swaps are seemingly isolated to those four. Then we brute-force all possible swaps for any operations that are touched by each of these digits. There were a total of 221 operations and each digit had an average of 80-150 operations. So this is somewhere in the vicinity of 75,000-100,000 combinations. This part ran very slowly, probably due to making copies of the problem state before attempting each combination and a fairly ineffecient solver. Then, part2 actually tries every combination of the candidate swaps, which is only 672 possibilities, using a collection of test addition cases.

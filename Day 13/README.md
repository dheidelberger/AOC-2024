# Day 13 statistics:

Input Downloaded: 12/13/2024, 12:00:11 AM\
Part 1 submitted: 12/13/2024, 12:25:19 AM (+00:25:07)\
Part 2 submitted: 12/13/2024, 12:26:06 AM (+00:00:47)

Part 1 Rank: 2689 (0 points)\
Part 2 Rank: 819 (0 points)

_Note that as of 2024 Day 8, input download happens automatically when I first run the part 1 template file. I do this immediately after opening the puzzle for the first time._

Part 1 Run Time: 24ms\
Part 2 Run Time: 24ms

_Code is run on a 2020 M1 Macbook Pro with 16GB of RAM_

h/t Wolfram Alpha for the algebra.\
Fed in the equation (y3 - b _ y2)/y1 = (x3 - b _ x2)/x1 and asked it to solve for b, which gave:\
`(x3 * y1 - x1 * y3) / (x2 * y1 - x1 * y2)`

Found the algebraic solution for part 1. I was looking for a quadratic equation or something since the possibility of multiple solutions was raised. But it looks like there was only one possible solution per machine. WA also gave several constraints, which I coded in, but I guess they never came up.

[Wolfram Alpha Link](https://www.wolframalpha.com/input?i2d=true&i=Divide%5B%5C%2840%29Subscript%5By%2C3%5D+-+b+*+Subscript%5By%2C2%5D%5C%2841%29%2CSubscript%5By%2C1%5D%5D+%3D+Divide%5B%5C%2840%29Subscript%5Bx%2C3%5D+-+b+*+Subscript%5Bx%2C2%5D%5C%2841%29%2CSubscript%5Bx%2C1%5D%5D+solve+for+b)

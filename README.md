# zero - a mathematical puzzle game

If you:

* are playing on mobile
* want to use keyboard controls
* are annoyed that dragging changes your mouse pointer to a selection pointer

[Please use this game-only version for the best playing experience.](http://zero.karaniwan.org/full)

## How to Play

Click/tap numbers to connect them to a chain. You can only connect numbers that are at the left, right, top, bottom of the last selected number. As a faster alternative, you can also drag/swipe through the numbers. Clicking the **X** button at the upper left clears the current chain.

When the sum of the chain ends in zero (e.g. 40, 130) you get rewards and side effects depending on whether the chain's length is composite or prime.

*   if it's _Composite_ (e.g. chain length is 4, 6, or 8 digits long), you gain 2 seconds on your time for each digit connected. However, each digit also gives you a 1 in 4 chance of replacing a digit in the grid with a **blocker**, a black cell that cannot be selected and added to the chain.
*   if it's _Prime_ (e.g. 2, 3, 5), you only gain 0.5 seconds for each digit, but instead of spawning blockers, each digit now has a 1 in 5 chance of removing a blocker in the grid.

Either way, the point value of the chain is `5 x (sum / 10)^3`. Some examples:

*   `1-2-3-4` - gives you 5 points (10 / 10 = 1, 5 x 1^3 = 5) and 8 extra seconds but has 4 chances of spawning blockers.
*   `9-3-8` - gives you 40 points (20 / 10 = 2, 5 x 2^3 = 40), 1.5 extra seconds, and 3 chances to clear blockers.

Game ends when the time runs out. The goal is 1 million points, but the game will not stop you from playing when you reach that point.

My personal best for a million is around 45 minutes.

## Basic Tips

Random clicking is an important part of the gameplay. Use whenever you need a lot of time.

The points you get from random clicking is (on the average) nowhere near what you get from carefully extending your chain so the former should not be your only strategy if you're going for good million times.

Dragging the chain is faster than clicking for both extending the chain and backtracking.

There are only a few combinations for 2 and 3 length chains. Remembering them will allow you to clear a few blockers without spending too much time.

The expected score for a full 64-length chain on a grid with even distribution of numbers from 1-9 only gives 163,840 points. Raising the average by even a small value can significantly increase that score.

## Credits

`zero` © 2015 [Bryan Bibat](http://bryanbibat.net)

The game uses [Phaser](http://phaser.io) v2.4.0-rc2.

Icons from Open Iconic — [www.useiconic.com/open](http://www.useiconic.com/open)

Initial playtesting and player input by the #gaming Slack channel of the [Phillippine Tech Hackers](https://www.facebook.com/groups/phackers/) community. Additional input from /r/WebGames and Hacker News.

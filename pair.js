const Pair = (x, y) => ({
    x,
    y,
    concat: ({x: x1, y: y1}) =>
        Pair(x.concat(x1), y.concat(y1)),
    bimap: (fx, fy) => Pair(fx(x), fy(y)),
    toList: () => [x, y]
}); // Merge two semigroups

module.exports = Pair;

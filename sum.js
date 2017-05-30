const Sum = x =>
       ({
           x,
           concat: ({x: y}) =>
               Sum(x + y),
           inspect: () =>
               `Sum(${x})`
       });
Sum.empty = () => Sum(0);


module.exports = Sum; 

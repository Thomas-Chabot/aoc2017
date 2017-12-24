function check (amount, index, offset) {
  var lastIndex = 0;
  var prevIndex = 0;

  for (var i = 1; i <= amount; i++) {
    prevIndex = (prevIndex + offset) % i + 1;
    if (prevIndex === index)
      lastIndex = i;
  }

  return lastIndex;
}

console.log (check (50000000, 1, 348));

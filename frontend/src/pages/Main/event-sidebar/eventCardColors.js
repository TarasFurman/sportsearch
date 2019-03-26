export function randomColorClass() {
  const myArray = ['#4a148c', '#6a1b9a', '#7b1fa2', '#8e24aa', '#9c27b0', '#ab47bc', '#ba68c8', '#ce93d8', '#f3e5f5'];
  const randomColor = myArray[Math.floor(Math.random() * myArray.length)];
  return randomColor;
}

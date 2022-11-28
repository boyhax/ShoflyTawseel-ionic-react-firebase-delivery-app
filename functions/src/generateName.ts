export function generateName() {
  const str= "abcdefghijklmnopqrstuvwxyz";
  const num = "1234567890";
  const mix = str+num;
  const newName = shuffle(mix).slice(0, 10);
  console.log("newName :>> ", newName);
  return newName;
}
const shuffle = (str:string) => str.
    split("")
    .sort(()=>Math
        .random()-.5).join("");


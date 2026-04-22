console.log("Stressing CPU...");
const end = Date.now() + 20000;

while (Date.now() < end) {
  Math.sqrt(Math.random() * 99999999);
}

console.log("Done.");
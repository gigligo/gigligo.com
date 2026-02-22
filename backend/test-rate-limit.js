const http = require('http');

async function testLimit() {
  let successCount = 0;
  let failCount = 0;

  const promises = [];
  for (let i = 0; i < 110; i++) {
    promises.push(
      new Promise((resolve) => {
        http.get('http://localhost:3001/', (res) => {
          if (res.statusCode === 429) {
            failCount++;
          } else if (res.statusCode === 200 || res.statusCode === 201) {
            successCount++;
          } else {
            console.log("Unexpected status:", res.statusCode);
          }
          resolve();
        }).on('error', (e) => {
          console.error(e);
          failCount++;
          resolve();
        });
      })
    );
  }

  await Promise.all(promises);
  console.log(`Success: ${successCount}, Rate Limited (429): ${failCount}`);
}

testLimit();

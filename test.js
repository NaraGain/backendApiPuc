// test.js
const server = require('./index'); // Import the server from app.js
const assert = require('assert')
const http = require('http')

describe('Server Tests', ()=>{
    describe('Your Functionlity Test', ()=>{
        it('should perform a specific action', function (done) {
            // Perform your test logic here
            // For example, make a request to your server and assert the response
      
            // Replace this with your actual test logic
            // For example, if you have an HTTP server running on localhost:3000:
            http.get('http://localhost:4000', function (res) {
              // Assuming the response should have a status code of 200
              assert.strictEqual(res.statusCode, 200);
              // Call done() to signal the end of this test case
              done();
            })
        })
        function yourFunctionToTest(num){
            if(num !== 1){
                return 'faild'
            }
            return num
        }
        // Test case to check another functionality
    it('should do something else', function () {
        // Your test logic here
        // For example, check the output of a function or a module
        const result = yourFunctionToTest(1);
        assert.strictEqual(result,1);
      });
    })
    server.close()
})
<!DOCTYPE html>
<html>
  <head>
    <title>Home Page</title>
    <style>
      /* Add some basic styling */
      body {
        font-family: Arial, sans-serif;
        background: linear-gradient(45deg, #1d80c8, #0071bc);
      }

      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 50px;
        text-align: center;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
      }

      h1 {
        font-size: 48px;
        margin-bottom: 20px;
        color: #1d80c8;
      }

      p {
        font-size: 24px;
        margin-bottom: 40px;
        color: #333;
      }

      button {
        background-color: #1d80c8;
        color: white;
        padding: 15px 30px;
        border: none;
        border-radius: 5px;
        font-size: 18px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      button:hover {
        background-color: #0071bc;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h1>Welcome to My Website</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <button onclick="location.href='login.html'">Login</button>
    </div>
  </body>
</html>

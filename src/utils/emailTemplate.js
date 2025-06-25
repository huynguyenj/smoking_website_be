export const NOTIFICATION_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Health notification</title>
</head>
<body>
  <header style="background-color: #198754; padding: 1rem;">
    <h1 style="text-align: center; color: white;">Notification</h1>
  </header>
  <main>
    <p style="font-size: 1.25rem; padding: 2rem;">
          🔥{message}
    </p>
  </main>
  <footer style="position: absolute; bottom: 0; left: 0; background-color: #e7eaf6; width: 100%; padding: 10;">
      <p style="font-weight: bold; font-size: 18px; text-align: center;">&copy;Smoking-web. All serve customer with heart💖</p>
  </footer>
</body>
</html>`
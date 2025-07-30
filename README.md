### Step-by-Step UI Deployment Guide

1. **Log in to Cloudflare**

   Go to [https://dash.cloudflare.com/](https://dash.cloudflare.com/) and sign in to your account

2. **Go to "Workers & Pages"**

   - In the left sidebar, click on **“Workers & Pages”**

3. **Create a New Worker**

   - Click the **“Create application”** button
   - Select **“Create Worker”**
   - Enter a name

4. **Replace the Default Script**

   - Delete the default template code
   - Paste the contents of `src/index.js` from this repo

5. **Update Target Domains**

   In the pasted code, you’ll see this section:

   ```js
   const HOST_MAPS = {
   	landing: 'localhost:3001', // Replace with your landing domain
   	api: 'localhost:3002', // Replace with your API domain
   	cabinet: 'localhost:3003', // Replace with your cabinet domain
   };
   ```

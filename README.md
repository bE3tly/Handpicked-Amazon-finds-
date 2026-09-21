# Handpicked Finds - Setup

1.  **Firebase Project**: Ensure your Firebase project has Firestore and Google Authentication enabled.
2.  **Firebase Rules**: Configure your Firestore rules to allow only authorized users (e.g., your email) to write to the `products` collection.
3.  **Netlify Function**:
    *   Deploy the `netlify/functions/fetch-product.js` function to Netlify.
    *   Set the `AMAZON_ACCESS_KEY`, `AMAZON_SECRET_KEY`, and `AMAZON_PARTNER_TAG` environment variables in your Netlify dashboard.
4.  **Hosting**: You can host this static site on Firebase Hosting or any other static site hosting provider.

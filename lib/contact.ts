/**
 * Contact configuration
 * Configured for direct Discord messaging and social connections.
 */
export const CONTACT = {
  name: "Prativa Dahal",
  discord: {
    /**
     * Discord username / tag displayed on the card with one-click copy.
     */
    username: "prativadahal",
    /**
     * Direct Discord URL. Can be a user profile link (https://discord.com/users/<user_id>),
     * or a direct message link / server invite (https://discord.gg/<code_or_vanity>).
     * If using user ID, format is: https://discord.com/users/your_id
     */
    url: "https://discord.com/users/prativadahal",
    /**
     * Fallback Discord community or server invite link if available.
     */
    inviteUrl: "https://discord.gg/",
  },
  email: "prativad32@gmail.com",
  /**
   * Web3Forms access key (public by design — scoped to `email` above).
   * Contact form submissions POST to https://api.web3forms.com/submit with this
   * key, and Web3Forms forwards the message to that inbox. No activation needed.
   */
  web3FormsAccessKey: "a1189d63-a60e-4328-9e43-07712e1d1463",
} as const;

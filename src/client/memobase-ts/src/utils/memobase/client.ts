export const memoBaseClient = {
  getOrCreateUser: async (userId: string) => ({
    context: async (maxTokens: number) => {
      console.log(`🧠 Generating mock context for user ${userId} (${maxTokens} tokens)`);
      return `This is mock memory context for user ${userId}.`;
    }
  })
};

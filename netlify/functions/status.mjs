export default async () => {
  return Response.json({ ai: !!process.env.ANTHROPIC_API_KEY });
};

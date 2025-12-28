import { NextRequest, NextResponse } from "next/server";

// --- 1. THE MATH ENGINE (Replaces Python Script) ---

// Helper: Clean text and split into words (Tokens)
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove special chars
    .split(/\s+/) // Split by spaces
    .filter((word) => word.length > 2); // Ignore short words (e.g., "to", "is")
}

// Helper: Convert tokens into a Frequency Vector (Bag of Words)
// Example: ["react", "react", "node"] => { react: 2, node: 1 }
function createVector(tokens: string[]): Record<string, number> {
  const vector: Record<string, number> = {};
  tokens.forEach((token) => {
    vector[token] = (vector[token] || 0) + 1;
  });
  return vector;
}

// Helper: Calculate Cosine Similarity between two vectors
function calculateCosineSimilarity(
  vecA: Record<string, number>,
  vecB: Record<string, number>
): number {
  // Find common words
  const intersection = Object.keys(vecA).filter((key) =>
    Object.prototype.hasOwnProperty.call(vecB, key)
  );

  if (intersection.length === 0) return 0;

  // Calculate Dot Product (A . B)
  let dotProduct = 0;
  intersection.forEach((key) => {
    dotProduct += vecA[key] * vecB[key];
  });

  // Calculate Magnitudes (|A| and |B|)
  const magnitudeA = Math.sqrt(
    Object.values(vecA).reduce((sum, val) => sum + val * val, 0)
  );
  const magnitudeB = Math.sqrt(
    Object.values(vecB).reduce((sum, val) => sum + val * val, 0)
  );

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  // Final Formula: (A . B) / (|A| * |B|)
  return (dotProduct / (magnitudeA * magnitudeB)) * 100;
}

// --- 2. THE API ROUTE ---

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDesc } = await req.json();

    if (!resumeText || !jobDesc) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    // Step A: Process Texts
    const resumeTokens = tokenize(resumeText);
    const jobTokens = tokenize(jobDesc);

    // Step B: Vectorize
    const resumeVector = createVector(resumeTokens);
    const jobVector = createVector(jobTokens);

    // Step C: Calculate Scores
    // 1. Vibe Check (Cosine Similarity)
    const cosineSim = calculateCosineSimilarity(resumeVector, jobVector);

    // 2. Keyword Checklist (Percentage of Job Keywords found in Resume)
    // We use a Set to get unique keywords from the job description
    const uniqueJobWords = Array.from(new Set(jobTokens));
    const matchedWords = uniqueJobWords.filter((word) =>
      resumeTokens.includes(word)
    );

    const keywordScore =
      uniqueJobWords.length > 0
        ? (matchedWords.length / uniqueJobWords.length) * 100
        : 0;

    // Step D: Final Weighted Score
    // We weigh Keywords higher (60%) because ATS bots care about skills
    let finalScore = cosineSim * 0.4 + keywordScore * 0.6;

    // Boost Curve: If it's a decent match, boost it to look like a human score
    if (finalScore > 15) {
      finalScore = Math.min(98, finalScore * 1.5 + 10);
    }

    return NextResponse.json({
      success: true,
      score: Math.round(finalScore * 10) / 10,
    });
  } catch (error) {
    console.error("Scan Error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { STOP_WORDS } from "@/utils/stopWords";

// Helper: Clean and Tokenize text
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .split(/\s+/) // Split by whitespace
    .filter((word) => word.length > 2) // Remove short words
    .filter((word) => !STOP_WORDS.has(word)); // REMOVE STOP WORDS
}

// Helper: Create Word Frequency Vector
function createVector(tokens: string[]): Record<string, number> {
  const vector: Record<string, number> = {};
  tokens.forEach((token) => {
    vector[token] = (vector[token] || 0) + 1;
  });
  return vector;
}

// Helper: Calculate Cosine Similarity
function calculateCosineSimilarity(
  vecA: Record<string, number>,
  vecB: Record<string, number>
): number {
  const intersection = Object.keys(vecA).filter((key) =>
    Object.prototype.hasOwnProperty.call(vecB, key)
  );

  if (intersection.length === 0) return 0;

  let dotProduct = 0;
  intersection.forEach((key) => {
    dotProduct += vecA[key] * vecB[key];
  });

  const magnitudeA = Math.sqrt(
    Object.values(vecA).reduce((sum, val) => sum + val * val, 0)
  );
  const magnitudeB = Math.sqrt(
    Object.values(vecB).reduce((sum, val) => sum + val * val, 0)
  );

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return (dotProduct / (magnitudeA * magnitudeB)) * 100;
}

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDesc } = await req.json();

    if (!resumeText || !jobDesc) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    // 1. Tokenize
    const resumeTokens = tokenize(resumeText);
    const jobTokens = tokenize(jobDesc);

    // 2. Vectorize
    const resumeVector = createVector(resumeTokens);
    const jobVector = createVector(jobTokens);

    // 3. Calculate Scores
    const cosineSim = calculateCosineSimilarity(resumeVector, jobVector);

    // 4. Keyword Match
    const uniqueJobWords = Array.from(new Set(jobTokens));
    const matchedWords = uniqueJobWords.filter((word) =>
      resumeTokens.includes(word)
    );

    const keywordScore =
      uniqueJobWords.length > 0
        ? (matchedWords.length / uniqueJobWords.length) * 100
        : 0;

    // 5. Final Weighted Score
    let finalScore = cosineSim * 0.4 + keywordScore * 0.6;

    // 6. Boost Logic
    if (finalScore > 50) {
      finalScore = Math.min(98, finalScore * 1.5 + 15);
    } else if (finalScore > 30) {
      finalScore = Math.min(88, finalScore * 1.5 + 10);
    } else if (finalScore > 15) {
      finalScore = finalScore * 1.2;
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

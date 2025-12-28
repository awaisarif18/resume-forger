import { NextRequest, NextResponse } from "next/server";

// 1. LIST OF COMMON "NOISE" WORDS TO IGNORE
const STOP_WORDS = new Set([
  "a",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "am",
  "an",
  "and",
  "any",
  "are",
  "aren't",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can",
  "cannot",
  "could",
  "couldn't",
  "did",
  "didn't",
  "do",
  "does",
  "doesn't",
  "doing",
  "don't",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "hadn't",
  "has",
  "hasn't",
  "have",
  "haven't",
  "having",
  "he",
  "he'd",
  "he'll",
  "he's",
  "her",
  "here",
  "here's",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "how's",
  "i",
  "i'd",
  "i'll",
  "i'm",
  "i've",
  "if",
  "in",
  "into",
  "is",
  "isn't",
  "it",
  "it's",
  "its",
  "itself",
  "let's",
  "me",
  "more",
  "most",
  "mustn't",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "ought",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "same",
  "shan't",
  "she",
  "she'd",
  "she'll",
  "she's",
  "should",
  "shouldn't",
  "so",
  "some",
  "such",
  "than",
  "that",
  "that's",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "there's",
  "these",
  "they",
  "they'd",
  "they'll",
  "they're",
  "they've",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "wasn't",
  "we",
  "we'd",
  "we'll",
  "we're",
  "we've",
  "were",
  "weren't",
  "what",
  "what's",
  "when",
  "when's",
  "where",
  "where's",
  "which",
  "while",
  "who",
  "who's",
  "whom",
  "why",
  "why's",
  "with",
  "won't",
  "would",
  "wouldn't",
  "you",
  "you'd",
  "you'll",
  "you're",
  "you've",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "will",
  "management",
  "system",
  "working",
  "experience",
  "responsible",
  "duties",
  "include",
  "team",
  "work", // Added some generic business filler words
]);

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

    // 1. Tokenize (Now with Stop Word Filtering)
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

    // Safety check for empty job description after filtering
    const keywordScore =
      uniqueJobWords.length > 0
        ? (matchedWords.length / uniqueJobWords.length) * 100
        : 0;

    // 5. Final Weighted Score
    // We reduced the boost curve significantly.
    // Before: min(98, score * 1.5 + 15)
    // Now: We only boost if the raw score is decent (>20)

    let finalScore = cosineSim * 0.4 + keywordScore * 0.6;

    // STRICTER BOOST LOGIC:
    // If score is very low (< 20%), it means fields are unrelated. Don't boost.
    // If score is decent (> 20%), apply a smaller curve.
    if (finalScore > 20) {
      finalScore = Math.min(95, finalScore * 1.2 + 5);
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

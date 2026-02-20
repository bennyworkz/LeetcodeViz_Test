
import { lazy } from 'react';
import { Module, Problem } from './types';

// Array / String
const MergeStringsVisualizer = lazy(() => import('./problems/MergeStringsVisualizer'));
const GCDStringsVisualizer = lazy(() => import('./problems/GCDStringsVisualizer'));
const KidsCandiesVisualizer = lazy(() => import('./problems/KidsCandiesVisualizer'));
const CanPlaceFlowersVisualizer = lazy(() => import('./problems/CanPlaceFlowersVisualizer'));
const ReverseVowelsVisualizer = lazy(() => import('./problems/ReverseVowelsVisualizer'));
const ReverseWordsVisualizer = lazy(() => import('./problems/ReverseWordsVisualizer'));
const ProductExceptSelfVisualizer = lazy(() => import('./problems/ProductExceptSelfVisualizer'));
const IncreasingTripletVisualizer = lazy(() => import('./problems/IncreasingTripletVisualizer'));
const StringCompressionVisualizer = lazy(() => import('./problems/StringCompressionVisualizer'));
const LongestCommonPrefixVisualizer = lazy(() => import('./problems/LongestCommonPrefixVisualizer'));
const SpiralMatrixVisualizer = lazy(() => import('./problems/SpiralMatrixVisualizer'));

// Two Pointers
const MoveZeroesVisualizer = lazy(() => import('./problems/MoveZeroesVisualizer'));
const IsSubsequenceVisualizer = lazy(() => import('./problems/IsSubsequenceVisualizer'));
const ContainerWithMostWaterVisualizer = lazy(() => import('./problems/ContainerWithMostWaterVisualizer'));
const MaxNumberKSumPairsVisualizer = lazy(() => import('./problems/MaxNumberKSumPairsVisualizer'));

// Sliding Window
const MaxAverageSubarrayVisualizer = lazy(() => import('./problems/MaxAverageSubarrayVisualizer'));
const MaxVowelsSubstringVisualizer = lazy(() => import('./problems/MaxVowelsSubstringVisualizer'));
const MaxConsecutiveOnesIIIVisualizer = lazy(() => import('./problems/MaxConsecutiveOnesIIIVisualizer'));
const LongestSubarrayOnesVisualizer = lazy(() => import('./problems/LongestSubarrayOnesVisualizer'));

// Prefix Sum
const HighestAltitudeVisualizer = lazy(() => import('./problems/HighestAltitudeVisualizer'));
const PivotIndexVisualizer = lazy(() => import('./problems/PivotIndexVisualizer'));

// Amazon Favorites
const TwoSumVisualizer = lazy(() => import('./problems/TwoSumVisualizer'));
const AddTwoNumbersVisualizer = lazy(() => import('./problems/AddTwoNumbersVisualizer'));
const LongestSubstringVisualizer = lazy(() => import('./problems/LongestSubstringVisualizer'));
const LongestPalindromicSubstringVisualizer = lazy(() => import('./problems/LongestPalindromicSubstringVisualizer'));
const MedianTwoSortedArraysVisualizer = lazy(() => import('./problems/MedianTwoSortedArraysVisualizer'));
const ThreeSumVisualizer = lazy(() => import('./problems/ThreeSumVisualizer'));
const ValidParenthesesVisualizer = lazy(() => import('./problems/ValidParenthesesVisualizer'));
const GenerateParenthesesVisualizer = lazy(() => import('./problems/GenerateParenthesesVisualizer'));
const TrappingRainWaterVisualizer = lazy(() => import('./problems/TrappingRainWaterVisualizer'));
const ThreeSumClosestVisualizer = lazy(() => import('./problems/ThreeSumClosestVisualizer'));
const MergeSortedArrayVisualizer = lazy(() => import('./problems/MergeSortedArrayVisualizer'));
const GroupAnagramsVisualizer = lazy(() => import('./problems/GroupAnagramsVisualizer'));
const MergeIntervalsVisualizer = lazy(() => import('./problems/MergeIntervalsVisualizer'));
const MergeKSortedListsVisualizer = lazy(() => import('./problems/MergeKSortedListsVisualizer'));
const MaximumSubarrayVisualizer = lazy(() => import('./problems/MaximumSubarrayVisualizer'));
const LetterCombinationsVisualizer = lazy(() => import('./problems/LetterCombinationsVisualizer'));

// Dynamic Programming / Greedy
const ClimbingStairsVisualizer = lazy(() => import('./problems/ClimbingStairsVisualizer'));
const JumpGameVisualizer = lazy(() => import('./problems/JumpGameVisualizer'));

export const modules: Module[] = [
  {
    id: 'amazon-favorites',
    title: 'Amazon Interview Prep',
    description: 'Frequently asked questions in Amazon technical interviews. Focus on Hash Maps, Two Pointers, and complex DP.',
    problems: [
      { id: '1-two-sum', number: 1, title: 'Two Sum', difficulty: 'Easy', component: TwoSumVisualizer },
      { id: '2-add-two-numbers', number: 2, title: 'Add Two Numbers', difficulty: 'Medium', component: AddTwoNumbersVisualizer },
      { id: '3-longest-substring', number: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', component: LongestSubstringVisualizer },
      { id: '4-median-two-sorted-arrays', number: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', component: MedianTwoSortedArraysVisualizer },
      { id: '5-longest-palindromic-substring', number: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium', component: LongestPalindromicSubstringVisualizer },
      { id: '11-container-with-most-water-amazon', number: 11, title: 'Container With Most Water', difficulty: 'Medium', component: ContainerWithMostWaterVisualizer },
      { id: '14-longest-common-prefix-amazon', number: 14, title: 'Longest Common Prefix', difficulty: 'Easy', component: LongestCommonPrefixVisualizer },
      { id: '15-3sum', number: 15, title: '3Sum', difficulty: 'Medium', component: ThreeSumVisualizer },
      { id: '16-3sum-closest', number: 16, title: '3Sum Closest', difficulty: 'Medium', component: ThreeSumClosestVisualizer },
      { id: '17-letter-combinations', number: 17, title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', component: LetterCombinationsVisualizer },
      { id: '20-valid-parentheses', number: 20, title: 'Valid Parentheses', difficulty: 'Easy', component: ValidParenthesesVisualizer },
      { id: '22-generate-parentheses', number: 22, title: 'Generate Parentheses', difficulty: 'Medium', component: GenerateParenthesesVisualizer },
      { id: '23-merge-k-sorted-lists', number: 23, title: 'Merge k Sorted Lists', difficulty: 'Hard', component: MergeKSortedListsVisualizer },
      { id: '42-trapping-rain-water', number: 42, title: 'Trapping Rain Water', difficulty: 'Hard', component: TrappingRainWaterVisualizer },
      { id: '49-group-anagrams', number: 49, title: 'Group Anagrams', difficulty: 'Medium', component: GroupAnagramsVisualizer },
      { id: '53-maximum-subarray-amazon', number: 53, title: 'Maximum Subarray', difficulty: 'Medium', component: MaximumSubarrayVisualizer },
      { id: '54-spiral-matrix', number: 54, title: 'Spiral Matrix', difficulty: 'Medium', component: SpiralMatrixVisualizer },
      { id: '55-jump-game-amazon', number: 55, title: 'Jump Game', difficulty: 'Medium', component: JumpGameVisualizer },
      { id: '56-merge-intervals', number: 56, title: 'Merge Intervals', difficulty: 'Medium', component: MergeIntervalsVisualizer },
      { id: '70-climbing-stairs-amazon', number: 70, title: 'Climbing Stairs', difficulty: 'Easy', component: ClimbingStairsVisualizer },
      { id: '88-merge-sorted-array', number: 88, title: 'Merge Sorted Array', difficulty: 'Easy', component: MergeSortedArrayVisualizer },
    ]
  },
  {
    id: 'greedy-dp',
    title: 'Greedy & DP',
    description: 'Optimization problems solved by breaking them down into overlapping subproblems or making local optimal choices.',
    problems: [
      { id: '55-jump-game', number: 55, title: 'Jump Game', difficulty: 'Medium', component: JumpGameVisualizer },
      { id: '70-climbing-stairs', number: 70, title: 'Climbing Stairs', difficulty: 'Easy', component: ClimbingStairsVisualizer },
    ]
  },
  {
    id: 'blind-75-array',
    title: 'Blind 75: Array / String',
    description: 'Fundamental array manipulation and string traversal techniques from the Blind 75 list.',
    problems: [
      { id: '1768-merge-strings', number: 1768, title: 'Merge Strings Alternately', difficulty: 'Easy', component: MergeStringsVisualizer },
      { id: '1071-gcd-strings', number: 1071, title: 'GCD of Strings', difficulty: 'Easy', component: GCDStringsVisualizer },
      { id: '1431-kids-candies', number: 1431, title: 'Kids With the Greatest Number of Candies', difficulty: 'Easy', component: KidsCandiesVisualizer },
      { id: '605-can-place-flowers', number: 605, title: 'Can Place Flowers', difficulty: 'Easy', component: CanPlaceFlowersVisualizer },
      { id: '345-reverse-vowels', number: 345, title: 'Reverse Vowels of a String', difficulty: 'Easy', component: ReverseVowelsVisualizer },
      { id: '151-reverse-words', number: 151, title: 'Reverse Words in a String', difficulty: 'Medium', component: ReverseWordsVisualizer },
      { id: '238-product-except-self', number: 238, title: 'Product of Array Except Self', difficulty: 'Medium', component: ProductExceptSelfVisualizer },
      { id: '334-increasing-triplet', number: 334, title: 'Increasing Triplet Subsequence', difficulty: 'Medium', component: IncreasingTripletVisualizer },
      { id: '443-string-compression', number: 443, title: 'String Compression', difficulty: 'Medium', component: StringCompressionVisualizer },
      { id: '53-maximum-subarray', number: 53, title: 'Maximum Subarray', difficulty: 'Medium', component: MaximumSubarrayVisualizer },
      { id: '14-longest-common-prefix', number: 14, title: 'Longest Common Prefix', difficulty: 'Easy', component: LongestCommonPrefixVisualizer },
    ]
  },
  {
    id: 'blind-75-two-pointers',
    title: 'Blind 75: Two Pointers',
    description: 'Efficiently scanning data using multiple pointers at different speeds or directions.',
    problems: [
      { id: '283-move-zeroes', number: 283, title: 'Move Zeroes', difficulty: 'Easy', component: MoveZeroesVisualizer },
      { id: '392-is-subsequence', number: 392, title: 'Is Subsequence', difficulty: 'Easy', component: IsSubsequenceVisualizer },
      { id: '11-container-with-most-water', number: 11, title: 'Container With Most Water', difficulty: 'Medium', component: ContainerWithMostWaterVisualizer },
      { id: '1679-max-k-sum-pairs', number: 1679, title: 'Max Number of K-Sum Pairs', difficulty: 'Medium', component: MaxNumberKSumPairsVisualizer },
    ]
  },
  {
    id: 'blind-75-sliding-window',
    title: 'Blind 75: Sliding Window',
    description: 'Optimizing subarray operations by maintaining a running state across a moving range.',
    problems: [
      { id: '643-max-average-subarray', number: 643, title: 'Maximum Average Subarray I', difficulty: 'Easy', component: MaxAverageSubarrayVisualizer },
      { id: '1456-max-vowels-substring', number: 1456, title: 'Max Vowels in a Substring', difficulty: 'Medium', component: MaxVowelsSubstringVisualizer },
      { id: '1004-max-consecutive-ones-iii', number: 1004, title: 'Max Consecutive Ones III', difficulty: 'Medium', component: MaxConsecutiveOnesIIIVisualizer },
      { id: '1493-longest-subarray-ones', number: 1493, title: "Longest Subarray of 1's After Deleting One", difficulty: 'Medium', component: LongestSubarrayOnesVisualizer },
    ]
  },
  {
    id: 'blind-75-prefix-sum',
    title: 'Blind 75: Prefix Sum',
    description: 'Creating cumulative totals to solve range queries and equilibrium problems in linear time.',
    problems: [
      { id: '1732-highest-altitude', number: 1732, title: 'Find the Highest Altitude', difficulty: 'Easy', component: HighestAltitudeVisualizer },
      { id: '724-pivot-index', number: 724, title: 'Find Pivot Index', difficulty: 'Easy', component: PivotIndexVisualizer },
    ]
  }
];

export const getProblemById = (id: string): Problem | undefined => {
  for (const module of modules) {
    const problem = module.problems.find((p) => p.id === id);
    if (problem) return problem;
  }
  return undefined;
};

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

export const modules: Module[] = [
  {
    id: 'array-string',
    title: 'Array / String',
    description: 'Fundamental array manipulation and string traversal techniques.',
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
    ]
  },
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    description: 'Efficiently scanning data using multiple pointers at different speeds or directions.',
    problems: [
      { id: '283-move-zeroes', number: 283, title: 'Move Zeroes', difficulty: 'Easy', component: MoveZeroesVisualizer },
      { id: '392-is-subsequence', number: 392, title: 'Is Subsequence', difficulty: 'Easy', component: IsSubsequenceVisualizer },
      { id: '11-container-with-most-water', number: 11, title: 'Container With Most Water', difficulty: 'Medium', component: ContainerWithMostWaterVisualizer },
      { id: '1679-max-k-sum-pairs', number: 1679, title: 'Max Number of K-Sum Pairs', difficulty: 'Medium', component: MaxNumberKSumPairsVisualizer },
    ]
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    description: 'Optimizing subarray operations by maintaining a running state across a moving range.',
    problems: [
      { id: '643-max-average-subarray', number: 643, title: 'Maximum Average Subarray I', difficulty: 'Easy', component: MaxAverageSubarrayVisualizer },
      { id: '1456-max-vowels-substring', number: 1456, title: 'Max Vowels in a Substring', difficulty: 'Medium', component: MaxVowelsSubstringVisualizer },
      { id: '1004-max-consecutive-ones-iii', number: 1004, title: 'Max Consecutive Ones III', difficulty: 'Medium', component: MaxConsecutiveOnesIIIVisualizer },
      { id: '1493-longest-subarray-ones', number: 1493, title: "Longest Subarray of 1's After Deleting One", difficulty: 'Medium', component: LongestSubarrayOnesVisualizer },
    ]
  },
  {
    id: 'prefix-sum',
    title: 'Prefix Sum',
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
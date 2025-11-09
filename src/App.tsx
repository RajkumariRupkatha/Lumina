import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Zap, Lock, CheckCircle, Star, Trophy, Target, ChevronRight, GraduationCap, Code, Rocket, Menu, Bell, Search, Home, Map, Users, Settings, LogOut, Flame, TrendingUp, Play, FileText, Video, MessageSquare, Calendar, Brain, CreditCard, X, Volume2, Maximize2, Download, Pause, List, UserCircle, Trash2 } from 'lucide-react';
import { db, storage } from './firebase';
import { collection, addDoc, onSnapshot, query, where, orderBy, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// ============================================================
// HARDCODED DATA STRUCTURES CONTENT (DSA Fundamentals Module)
// ============================================================

const HARDCODED_DSA_FLASHCARDS = [
  {
    question: "What is a Data Structure?",
    answer: "A data structure is a specialized format for organizing, processing, retrieving, and storing data. It enables efficient access and modification of data."
  },
  {
    question: "What are the two main categories of data structures?",
    answer: "Linear data structures (Arrays, Linked Lists, Stacks, Queues) and Non-linear data structures (Trees, Graphs, Hash Tables)."
  },
  {
    question: "What is an Array?",
    answer: "An array is a collection of elements of the same data type stored in contiguous memory locations, accessible by index. It provides O(1) access time."
  },
  {
    question: "What are the advantages of Arrays?",
    answer: "Fast access time O(1), efficient memory usage, cache-friendly due to contiguous storage, and simple implementation."
  },
  {
    question: "What are the disadvantages of Arrays?",
    answer: "Fixed size (static arrays), expensive insertion/deletion O(n), and wasted memory if not fully utilized."
  },
  {
    question: "What is a Linked List?",
    answer: "A linked list is a linear data structure where each element (node) contains data and a reference (pointer) to the next node in the sequence."
  },
  {
    question: "What are the types of Linked Lists?",
    answer: "Singly Linked List (one pointer to next), Doubly Linked List (pointers to both next and previous), and Circular Linked List (last node points to first)."
  },
  {
    question: "What are the advantages of Linked Lists?",
    answer: "Dynamic size, efficient insertion/deletion O(1) at known positions, and no memory wastage."
  },
  {
    question: "What is a Stack?",
    answer: "A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. Elements are added and removed from the same end called the 'top'."
  },
  {
    question: "What are the main operations of a Stack?",
    answer: "Push (add element to top), Pop (remove element from top), Peek/Top (view top element without removing), and isEmpty (check if stack is empty)."
  },
  {
    question: "What are common applications of Stacks?",
    answer: "Function call management (call stack), undo/redo functionality, expression evaluation, backtracking algorithms, and browser history."
  },
  {
    question: "What is a Queue?",
    answer: "A queue is a linear data structure that follows the First-In-First-Out (FIFO) principle. Elements are added at the rear and removed from the front."
  },
  {
    question: "What are the main operations of a Queue?",
    answer: "Enqueue (add element to rear), Dequeue (remove element from front), Front (view front element), and isEmpty (check if queue is empty)."
  },
  {
    question: "What are the types of Queues?",
    answer: "Simple Queue, Circular Queue (last position connects to first), Priority Queue (elements have priorities), and Double-ended Queue (Deque - insertion/deletion at both ends)."
  },
  {
    question: "What is a Tree data structure?",
    answer: "A tree is a hierarchical non-linear data structure consisting of nodes connected by edges, with a root node and parent-child relationships. No cycles are allowed."
  },
  {
    question: "What is a Binary Tree?",
    answer: "A binary tree is a tree where each node has at most two children, referred to as left child and right child."
  },
  {
    question: "What is a Binary Search Tree (BST)?",
    answer: "A BST is a binary tree where for each node: left subtree contains values less than the node, and right subtree contains values greater than the node. Enables O(log n) search."
  },
  {
    question: "What are common tree traversal methods?",
    answer: "In-order (Left-Root-Right), Pre-order (Root-Left-Right), Post-order (Left-Right-Root), and Level-order (Breadth-First)."
  },
  {
    question: "What is a Graph?",
    answer: "A graph is a non-linear data structure consisting of vertices (nodes) connected by edges. It can represent networks, relationships, and connections."
  },
  {
    question: "What are the types of Graphs?",
    answer: "Directed Graph (edges have direction), Undirected Graph (edges have no direction), Weighted Graph (edges have weights), and Cyclic/Acyclic Graphs."
  },
  {
    question: "What is a Hash Table?",
    answer: "A hash table is a data structure that stores key-value pairs using a hash function to compute an index into an array of buckets. Provides O(1) average-case access."
  },
  {
    question: "What is a Hash Function?",
    answer: "A hash function maps keys to indices in the hash table. A good hash function distributes keys uniformly to minimize collisions."
  },
  {
    question: "What are Hash Collisions?",
    answer: "A collision occurs when two different keys hash to the same index. Resolved using chaining (linked lists) or open addressing (probing)."
  },
  {
    question: "Why is choosing the right data structure important?",
    answer: "It directly impacts performance (time/space complexity), scalability, code maintainability, and resource efficiency of your application."
  },
  {
    question: "What is Time Complexity?",
    answer: "Time complexity measures the amount of time an algorithm takes to complete as a function of input size. Expressed using Big-O notation (e.g., O(1), O(n), O(log n))."
  }
];

const HARDCODED_DSA_QUIZ = [
  {
    question: "Which data structure uses the LIFO (Last-In-First-Out) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1
  },
  {
    question: "What is the time complexity for accessing an element in an array by index?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    correctAnswer: 2
  },
  {
    question: "In a Binary Search Tree, where are values less than the root stored?",
    options: ["Right subtree", "Left subtree", "Parent node", "Both subtrees"],
    correctAnswer: 1
  },
  {
    question: "Which data structure is best suited for implementing a browser's back button?",
    options: ["Queue", "Array", "Stack", "Hash Table"],
    correctAnswer: 2
  },
  {
    question: "What is the main advantage of a Linked List over an Array?",
    options: ["Faster access time", "Dynamic size", "Less memory usage", "Better cache performance"],
    correctAnswer: 1
  },
  {
    question: "Which data structure follows the FIFO (First-In-First-Out) principle?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correctAnswer: 1
  },
  {
    question: "What is the average time complexity for search operations in a Hash Table?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    correctAnswer: 2
  },
  {
    question: "Which traversal method visits nodes level by level in a tree?",
    options: ["In-order", "Pre-order", "Post-order", "Level-order"],
    correctAnswer: 3
  },
  {
    question: "What problem occurs when two keys hash to the same index in a Hash Table?",
    options: ["Overflow", "Collision", "Deadlock", "Segmentation fault"],
    correctAnswer: 1
  },
  {
    question: "Which data structure is most suitable for representing a network of cities connected by roads?",
    options: ["Array", "Stack", "Graph", "Queue"],
    correctAnswer: 2
  },
  {
    question: "In a Doubly Linked List, each node has pointers to:",
    options: ["Only the next node", "Only the previous node", "Both next and previous nodes", "The head and tail"],
    correctAnswer: 2
  },
  {
    question: "What is the main disadvantage of using an array?",
    options: ["Slow access time", "Fixed size", "High memory overhead", "Complex implementation"],
    correctAnswer: 1
  },
  {
    question: "Which data structure would you use to implement a priority queue?",
    options: ["Array", "Heap", "Stack", "Linked List"],
    correctAnswer: 1
  },
  {
    question: "What does Big-O notation describe?",
    options: ["Memory usage", "Code readability", "Algorithm efficiency", "Programming language"],
    correctAnswer: 2
  },
  {
    question: "In which scenario would you prefer a Linked List over an Array?",
    options: ["Random access is frequent", "Size is known and fixed", "Frequent insertions/deletions", "Memory is limited"],
    correctAnswer: 2
  }
];

const HARDCODED_DSA_MINDMAP = {
  central: "Data Structures & Algorithms",
  branches: [
    "Arrays - Contiguous Memory",
    "Linked Lists - Dynamic Nodes",
    "Stacks - LIFO Principle",
    "Queues - FIFO Principle",
    "Trees - Hierarchical Structure",
    "Graphs - Network Relationships",
    "Hash Tables - Key-Value Mapping",
    "Time Complexity - Big-O",
    "Space Complexity - Memory Usage",
    "Algorithm Efficiency",
    "Searching Algorithms",
    "Sorting Algorithms"
  ]
};

const HARDCODED_DSA_SUMMARY = `Data Structures & Algorithms (DSA) form the foundation of computer science and software engineering. A data structure is a specialized format for organizing, processing, and storing data efficiently.

**Linear Data Structures:**
Arrays provide fast O(1) access through indexing but have fixed size. Linked Lists offer dynamic sizing and efficient insertion/deletion but slower access times. Stacks follow LIFO (Last-In-First-Out) principle, useful for function calls and undo operations. Queues follow FIFO (First-In-First-Out) principle, ideal for task scheduling and breadth-first search.

**Non-Linear Data Structures:**
Trees organize data hierarchically with parent-child relationships. Binary Search Trees enable efficient O(log n) searching, insertion, and deletion. Graphs represent complex networks and relationships between entities, supporting both directed and undirected connections. Hash Tables provide O(1) average-case access through key-value mappings using hash functions.

**Key Concepts:**
Choosing the right data structure is critical for application performance, scalability, and maintainability. Time complexity (Big-O notation) measures algorithm efficiency, while space complexity considers memory usage. Understanding trade-offs between different data structures enables developers to build efficient, scalable software systems.`;

const HARDCODED_DSA_KEY_TOPICS = [
  "Arrays & Linked Lists",
  "Stacks & Queues",
  "Trees & BST",
  "Graphs & Networks",
  "Hash Tables",
  "Time Complexity",
  "Algorithm Efficiency",
  "Data Structure Selection"
];

// Mock Data
const STUDENT_DATA = {
  id: 'student-1',
  name: 'Alice Johnson',
  email: 'alice@demo.edu',
  major: 'Computer Science',
  year: 'Sophomore',
  xp: 380,
  level: 1,
  streak: 7,
  
  degreeProgress: {
    totalCredits: 120,
    earnedCredits: 45,
    currentSemester: 'Fall 2024',
    gpa: 3.7
  },
  
  semesters: [
    {
      id: 'fall-2024',
      name: 'Fall 2024',
      year: 2024,
      isCurrent: true
    },
    {
      id: 'spring-2024',
      name: 'Spring 2024',
      year: 2024,
      isCurrent: false
    },
    {
      id: 'fall-2023',
      name: 'Fall 2023',
      year: 2023,
      isCurrent: false
    }
  ],

  courses: [
    {
      id: 'cs-201',
      code: 'CS 201',
      title: 'Data Structures & Algorithms',
      professor: 'Dr. Sarah Chen',
      credits: 4,
      color: 'blue',
      semester: 'fall-2024',
      progress: 0,
      announcements: [
        {
          id: 'a1',
          title: 'Midterm Exam Schedule',
          date: '2024-10-15',
          content: 'The midterm exam will be held on October 25th in Room 301. Please review chapters 1-5.',
          priority: 'high'
        },
        {
          id: 'a2',
          title: 'Office Hours Update',
          date: '2024-10-12',
          content: 'Office hours moved to Tuesdays and Thursdays 2-4 PM.',
          priority: 'normal'
        },
        {
          id: 'a3',
          title: 'New Study Resources Available',
          date: '2024-10-10',
          content: 'Additional practice problems have been uploaded to the course portal.',
          priority: 'low'
        }
      ],
      assignments: [
        {
          id: 'asn1',
          title: 'Assignment 1: Array Implementation',
          dueDate: '2024-10-20',
          points: 100,
          submitted: true,
          grade: 95,
          status: 'graded'
        },
        {
          id: 'asn2',
          title: 'Assignment 2: Linked List Operations',
          dueDate: '2024-10-27',
          points: 100,
          submitted: true,
          grade: null,
          status: 'submitted'
        },
        {
          id: 'asn3',
          title: 'Assignment 3: Stack & Queue Problems',
          dueDate: '2024-11-03',
          points: 100,
          submitted: false,
          grade: null,
          status: 'pending'
        },
        {
          id: 'asn4',
          title: 'Assignment 4: Tree Traversal',
          dueDate: '2024-11-10',
          points: 100,
          submitted: false,
          grade: null,
          status: 'not-started'
        }
      ],
      grades: {
        overall: 87.5,
        breakdown: [
          { category: 'Assignments', weight: 40, score: 95 },
          { category: 'Midterm', weight: 25, score: 82 },
          { category: 'Quizzes', weight: 15, score: 88 },
          { category: 'Final Exam', weight: 20, score: null }
        ]
      },
      attendance: [
        { date: '2024-09-02', status: 'present' },
        { date: '2024-09-04', status: 'present' },
        { date: '2024-09-09', status: 'present' },
        { date: '2024-09-11', status: 'present' },
        { date: '2024-09-16', status: 'absent' },
        { date: '2024-09-18', status: 'present' },
        { date: '2024-09-23', status: 'present' },
        { date: '2024-09-25', status: 'present' },
        { date: '2024-09-30', status: 'late' },
        { date: '2024-10-02', status: 'present' },
        { date: '2024-10-07', status: 'present' },
        { date: '2024-10-09', status: 'present' }
      ],
      modules: [
        {
          id: 'dsa-m1',
          week: 1,
          title: 'Introduction to Algorithms',
          completion: 100,
          status: 'completed',
          xp: 20,
          materials: [
            { type: 'slides', title: 'Algorithm Basics.pdf', url: '#' },
            { type: 'video', title: 'Complexity Analysis', duration: '42 min' },
            { type: 'pdf', title: 'Big O Notation Guide.pdf', url: '#' }
          ]
        },
        {
          id: 'dsa-m2',
          week: 2,
          title: 'Arrays & Linked Lists',
          completion: 100,
          status: 'completed',
          xp: 25,
          materials: [
            { type: 'slides', title: 'Array Operations.pdf', url: '#' },
            { type: 'video', title: 'Linked List Implementation', duration: '50 min' },
            { type: 'pdf', title: 'Memory Management.pdf', url: '#' }
          ]
        },
        {
          id: 'dsa-m3',
          week: 3,
          title: 'Stacks & Queues',
          completion: 100,
          status: 'completed',
          xp: 25,
          materials: [
            { type: 'slides', title: 'Stack Implementation.pdf', url: '#' },
            { type: 'video', title: 'Queue Applications', duration: '45 min' },
            { type: 'pdf', title: 'LIFO vs FIFO.pdf', url: '#' }
          ]
        },
        {
          id: 'dsa-m4',
          week: 4,
          title: 'Trees & Graphs',
          completion: 75,
          status: 'in-progress',
          xp: 30,
          materials: [
            { type: 'slides', title: 'Binary Trees.pdf', url: '#' },
            { type: 'video', title: 'Graph Traversal', duration: '55 min' },
            { type: 'pdf', title: 'Tree Algorithms.pdf', url: '#' }
          ]
        },
        {
          id: 'dsa-m5',
          week: 5,
          title: 'Sorting Algorithms',
          completion: 0,
          status: 'available',
          xp: 25,
          materials: [
            { type: 'slides', title: 'Sorting Methods.pdf', url: '#' },
            { type: 'video', title: 'Quick Sort Explained', duration: '48 min' },
            { type: 'pdf', title: 'Merge Sort Guide.pdf', url: '#' }
          ]
        },
        {
          id: 'dsa-m6',
          week: 6,
          title: 'Search Algorithms',
          completion: 0,
          status: 'locked',
          xp: 25,
          materials: [
            { type: 'slides', title: 'Binary Search.pdf', url: '#' },
            { type: 'video', title: 'Search Optimization', duration: '40 min' },
            { type: 'pdf', title: 'Hashing Techniques.pdf', url: '#' }
          ]
        },
        {
          id: 'dsa-m7',
          week: 7,
          title: 'Dynamic Programming',
          completion: 0,
          status: 'locked',
          xp: 30,
          materials: [
            { type: 'slides', title: 'DP Fundamentals.pdf', url: '#' },
            { type: 'video', title: 'Memoization vs Tabulation', duration: '52 min' },
            { type: 'pdf', title: 'DP Problems.pdf', url: '#' }
          ]
        },
        {
          id: 'dsa-m8',
          week: 8,
          title: 'Greedy Algorithms',
          completion: 0,
          status: 'locked',
          xp: 25,
          materials: [
            { type: 'slides', title: 'Greedy Strategy.pdf', url: '#' },
            { type: 'video', title: 'Optimization Problems', duration: '46 min' },
            { type: 'pdf', title: 'Greedy vs DP.pdf', url: '#' }
          ]
        }
      ]
    },
    {
      id: 'cs-301',
      code: 'CS 301',
      title: 'Web Development',
      professor: 'Prof. Michael Torres',
      credits: 3,
      color: 'green',
      semester: 'fall-2024',
      progress: 40,
      announcements: [],
      assignments: [
        {
          id: 'web1',
          title: 'Project 1: Portfolio Website',
          dueDate: '2024-10-22',
          points: 150,
          submitted: true,
          grade: 142,
          status: 'graded'
        },
        {
          id: 'web2',
          title: 'Quiz: JavaScript Basics',
          dueDate: '2024-10-25',
          points: 50,
          submitted: false,
          grade: null,
          status: 'pending'
        },
        {
          id: 'web3',
          title: 'Project 2: React Todo App',
          dueDate: '2024-11-05',
          points: 200,
          submitted: false,
          grade: null,
          status: 'not-started'
        }
      ],
      grades: { overall: 0, breakdown: [] },
      attendance: [],
      modules: [
        {
          id: 'web-m1',
          week: 1,
          title: 'Introduction to HTML & CSS',
          completion: 100,
          status: 'completed',
          xp: 20,
          materials: [
            { type: 'slides', title: 'HTML Basics.pdf', url: '#' },
            { type: 'video', title: 'CSS Fundamentals', duration: '45 min' },
            { type: 'pdf', title: 'HTML Tags Reference.pdf', url: '#' }
          ]
        },
        {
          id: 'web-m2',
          week: 2,
          title: 'Responsive Web Design',
          completion: 100,
          status: 'completed',
          xp: 25,
          materials: [
            { type: 'slides', title: 'Flexbox & Grid.pdf', url: '#' },
            { type: 'video', title: 'Media Queries Tutorial', duration: '38 min' },
            { type: 'pdf', title: 'Bootstrap Framework.pdf', url: '#' }
          ]
        },
        {
          id: 'web-m3',
          week: 3,
          title: 'JavaScript Fundamentals',
          completion: 100,
          status: 'completed',
          xp: 25,
          materials: [
            { type: 'slides', title: 'JS Variables & Functions.pdf', url: '#' },
            { type: 'video', title: 'DOM Manipulation', duration: '52 min' },
            { type: 'pdf', title: 'ES6 Features Guide.pdf', url: '#' }
          ]
        },
        {
          id: 'web-m4',
          week: 4,
          title: 'Asynchronous JavaScript',
          completion: 100,
          status: 'completed',
          xp: 30,
          materials: [
            { type: 'slides', title: 'Promises & Async Await.pdf', url: '#' },
            { type: 'video', title: 'Fetch API Tutorial', duration: '41 min' },
            { type: 'pdf', title: 'AJAX Fundamentals.pdf', url: '#' }
          ]
        },
        {
          id: 'web-m5',
          week: 5,
          title: 'React Basics',
          completion: 65,
          status: 'in-progress',
          xp: 25,
          materials: [
            { type: 'slides', title: 'React Components.pdf', url: '#' },
            { type: 'video', title: 'State & Props Explained', duration: '55 min' },
            { type: 'pdf', title: 'JSX Syntax Guide.pdf', url: '#' }
          ]
        },
        {
          id: 'web-m6',
          week: 6,
          title: 'React Hooks & State Management',
          completion: 0,
          status: 'available',
          xp: 30,
          materials: [
            { type: 'slides', title: 'useState & useEffect.pdf', url: '#' },
            { type: 'video', title: 'Context API Tutorial', duration: '48 min' },
            { type: 'pdf', title: 'Custom Hooks Guide.pdf', url: '#' }
          ]
        },
        {
          id: 'web-m7',
          week: 7,
          title: 'Backend Development with Node.js',
          completion: 0,
          status: 'locked',
          xp: 35,
          materials: [
            { type: 'slides', title: 'Node.js Basics.pdf', url: '#' },
            { type: 'video', title: 'Express Framework', duration: '62 min' },
            { type: 'pdf', title: 'RESTful APIs.pdf', url: '#' }
          ]
        },
        {
          id: 'web-m8',
          week: 8,
          title: 'Database Integration & MongoDB',
          completion: 0,
          status: 'locked',
          xp: 35,
          materials: [
            { type: 'slides', title: 'MongoDB Fundamentals.pdf', url: '#' },
            { type: 'video', title: 'Mongoose ODM Tutorial', duration: '50 min' },
            { type: 'pdf', title: 'Database Design Patterns.pdf', url: '#' }
          ]
        }
      ]
    },
    {
      id: 'math-210',
      code: 'MATH 210',
      title: 'Discrete Mathematics',
      professor: 'Prof. Lisa Anderson',
      credits: 4,
      color: 'purple',
      semester: 'fall-2024',
      progress: 68,
      announcements: [],
      assignments: [
        {
          id: 'math1',
          title: 'Homework 4: Graph Theory Problems',
          dueDate: '2024-10-23',
          points: 100,
          submitted: true,
          grade: null,
          status: 'submitted'
        },
        {
          id: 'math2',
          title: 'Midterm Exam',
          dueDate: '2024-10-28',
          points: 200,
          submitted: false,
          grade: null,
          status: 'pending'
        },
        {
          id: 'math3',
          title: 'Homework 5: Combinatorics',
          dueDate: '2024-11-08',
          points: 100,
          submitted: false,
          grade: null,
          status: 'not-started'
        }
      ],
      grades: { overall: 0, breakdown: [] },
      attendance: [],
      modules: [
        {
          id: 'math-m1',
          week: 1,
          title: 'Introduction to Logic & Proofs',
          completion: 100,
          materials: [
            { type: 'slides', title: 'Propositional Logic.pdf', url: '#' },
            { type: 'video', title: 'Truth Tables Tutorial', duration: '42 min' },
            { type: 'pdf', title: 'Proof Techniques.pdf', url: '#' }
          ]
        },
        {
          id: 'math-m2',
          week: 2,
          title: 'Set Theory',
          completion: 100,
          materials: [
            { type: 'slides', title: 'Sets and Operations.pdf', url: '#' },
            { type: 'video', title: 'Venn Diagrams Explained', duration: '35 min' },
            { type: 'pdf', title: 'Set Identities.pdf', url: '#' }
          ]
        },
        {
          id: 'math-m3',
          week: 3,
          title: 'Functions & Relations',
          completion: 100,
          materials: [
            { type: 'slides', title: 'Function Types.pdf', url: '#' },
            { type: 'video', title: 'Bijective Functions', duration: '38 min' },
            { type: 'pdf', title: 'Equivalence Relations.pdf', url: '#' }
          ]
        },
        {
          id: 'math-m4',
          week: 4,
          title: 'Graph Theory Basics',
          completion: 85,
          materials: [
            { type: 'slides', title: 'Graphs & Vertices.pdf', url: '#' },
            { type: 'video', title: 'Path & Circuit Algorithms', duration: '50 min' },
            { type: 'pdf', title: 'Euler & Hamilton.pdf', url: '#' }
          ]
        },
        {
          id: 'math-m5',
          week: 5,
          title: 'Trees & Graph Algorithms',
          completion: 80,
          materials: [
            { type: 'slides', title: 'Spanning Trees.pdf', url: '#' },
            { type: 'video', title: 'Minimum Spanning Tree', duration: '45 min' },
            { type: 'pdf', title: 'Tree Traversal Methods.pdf', url: '#' }
          ]
        },
        {
          id: 'math-m6',
          week: 6,
          title: 'Counting Principles',
          completion: 65,
          materials: [
            { type: 'slides', title: 'Permutations & Combinations.pdf', url: '#' },
            { type: 'video', title: 'Pigeonhole Principle', duration: '40 min' },
            { type: 'pdf', title: 'Binomial Theorem.pdf', url: '#' }
          ]
        },
        {
          id: 'math-m7',
          week: 7,
          title: 'Probability Theory',
          completion: 50,
          materials: [
            { type: 'slides', title: 'Basic Probability.pdf', url: '#' },
            { type: 'video', title: 'Conditional Probability', duration: '48 min' },
            { type: 'pdf', title: 'Bayes Theorem.pdf', url: '#' }
          ]
        },
        {
          id: 'math-m8',
          week: 8,
          title: 'Recurrence Relations',
          completion: 35,
          materials: [
            { type: 'slides', title: 'Solving Recurrences.pdf', url: '#' },
            { type: 'video', title: 'Fibonacci Sequence', duration: '43 min' },
            { type: 'pdf', title: 'Master Theorem.pdf', url: '#' }
          ]
        },
        {
          id: 'math-m9',
          week: 9,
          title: 'Number Theory',
          completion: 20,
          materials: [
            { type: 'slides', title: 'Divisibility & GCD.pdf', url: '#' },
            { type: 'video', title: 'Modular Arithmetic', duration: '52 min' },
            { type: 'pdf', title: 'Prime Numbers.pdf', url: '#' }
          ]
        },
        {
          id: 'math-m10',
          week: 10,
          title: 'Boolean Algebra',
          completion: 0,
          materials: [
            { type: 'slides', title: 'Boolean Functions.pdf', url: '#' },
            { type: 'video', title: 'Logic Gates & Circuits', duration: '47 min' },
            { type: 'pdf', title: 'Karnaugh Maps.pdf', url: '#' }
          ]
        }
      ]
    },
    // Spring 2024 Courses
    {
      id: 'cs-150',
      code: 'CS 150',
      title: 'Introduction to Programming',
      professor: 'Dr. John Smith',
      credits: 4,
      color: 'blue',
      semester: 'spring-2024',
      progress: 100,
      announcements: [],
      assignments: [],
      grades: { overall: 0, breakdown: [] },
      attendance: [],
      modules: []
    },
    {
      id: 'math-140',
      code: 'MATH 140',
      title: 'Calculus I',
      professor: 'Prof. Emily Davis',
      credits: 4,
      color: 'red',
      semester: 'spring-2024',
      progress: 100,
      announcements: [],
      assignments: [],
      grades: { overall: 0, breakdown: [] },
      attendance: [],
      modules: []
    },
    // Fall 2023 Courses
    {
      id: 'eng-101',
      code: 'ENG 101',
      title: 'English Composition',
      professor: 'Prof. Jane Williams',
      credits: 3,
      color: 'orange',
      semester: 'fall-2023',
      progress: 100,
      announcements: [],
      assignments: [],
      grades: { overall: 0, breakdown: [] },
      attendance: [],
      modules: []
    },
    {
      id: 'hist-200',
      code: 'HIST 200',
      title: 'World History',
      professor: 'Dr. Robert Brown',
      credits: 3,
      color: 'indigo',
      semester: 'fall-2023',
      progress: 100,
      announcements: [],
      assignments: [],
      grades: { overall: 0, breakdown: [] },
      attendance: [],
      modules: []
    }
  ]
};

// Professor Data
const PROFESSOR_DATA = {
  id: 'prof-1',
  name: 'Dr. Sarah Chen',
  email: 'sarah.chen@demo.edu',
  department: 'Computer Science',
  courses: [
    {
      id: 'cs-201',
      code: 'CS 201',
      title: 'Data Structures & Algorithms',
      semester: 'Fall 2024',
      enrolledStudents: 45,
      color: 'blue',
      modules: []
    },
    {
      id: 'cs-301',
      code: 'CS 301',
      title: 'Web Development',
      semester: 'Fall 2024',
      enrolledStudents: 38,
      color: 'green',
      modules: []
    }
  ]
};

// Gemini API Configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const GEMINI_TTS_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-tts:generateContent';

// Helper function to call Gemini API (supports text and images/PDFs)
async function callGeminiAPI(prompt: string, fileBase64?: string, mimeType?: string) {
  if (!GEMINI_API_KEY) {
    console.warn('⚠️ Gemini API key not found. Using mock data.');
    return null;
  }

  console.log('🔑 API Key present:', GEMINI_API_KEY ? 'Yes' : 'No');
  console.log('📡 Calling Gemini API...');
  console.log('🖼️ Multimodal:', fileBase64 ? 'Yes' : 'No');

  try {
    // Build request parts - include image/PDF if provided
    const parts: any[] = [{ text: prompt }];

    if (fileBase64 && mimeType) {
      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: fileBase64
        }
      });
      console.log('📎 Attached file:', mimeType);
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: parts
        }]
      })
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Gemini API error response:', errorData);
      console.error('Error details:', JSON.stringify(errorData, null, 2));
      return null;
    }

    const data = await response.json();
    console.log('✅ Gemini API response received');

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('❌ Invalid response structure:', data);
      return null;
    }

    const resultText = data.candidates[0].content.parts[0].text;
    console.log('📝 Generated text length:', resultText.length, 'characters');
    console.log('📝 Generated text preview:', resultText.substring(0, 500));
    return resultText;
  } catch (error) {
    console.error('❌ Gemini API error:', error);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    return null;
  }
}

// Helper function to call Gemini TTS API for audio narration
async function generateTTSAudio(text: string): Promise<string | null> {
  if (!GEMINI_API_KEY) {
    console.warn('⚠️ Gemini API key not found. Skipping TTS generation.');
    return null;
  }

  console.log('🎙️ Generating TTS audio narration...');
  console.log('📝 Text length:', text.length, 'characters');

  try {
    const response = await fetch(`${GEMINI_TTS_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: text
          }]
        }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Kore'  // Natural, friendly voice
              }
            }
          }
        }
      })
    });

    console.log('📥 TTS Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Gemini TTS API error response:', errorData);
      return null;
    }

    const data = await response.json();
    console.log('✅ Gemini TTS API response received');

    // Extract base64 audio data from response
    const audioData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!audioData) {
      console.error('❌ No audio data in TTS response');
      return null;
    }

    console.log('🎵 Audio data received, length:', audioData.length, 'characters');
    return audioData;  // Return base64 audio string
  } catch (error) {
    console.error('❌ Gemini TTS API error:', error);
    return null;
  }
}

// Calculate course progress
const calculateCourseProgress = (modules) => {
  if (!modules || modules.length === 0) return 0;
  const totalCompletion = modules.reduce((sum, module) => sum + module.completion, 0);
  return Math.round(totalCompletion / modules.length);
};

// Calculate initial course progress
const coursesWithProgress = STUDENT_DATA.courses.map(course => ({
  ...course,
  progress: calculateCourseProgress(course.modules)
}));

STUDENT_DATA.courses = coursesWithProgress;

// AI Study Tools (4 core tools)
const AI_TOOLS = [
  {
    id: 'mindmap',
    icon: Brain,
    title: 'Mind Map',
    description: 'Visual concept connections',
    color: 'purple'
  },
  {
    id: 'flashcards',
    icon: CreditCard,
    title: 'Flashcards',
    description: 'Study with AI-generated cards',
    color: 'green'
  },
  {
    id: 'quiz',
    icon: CheckCircle,
    title: 'Quiz',
    description: 'Test your knowledge',
    color: 'orange'
  },
  {
    id: 'chat',
    icon: MessageSquare,
    title: 'AI Chat',
    description: 'Ask questions about this module',
    color: 'indigo'
  }
];

// Achievements Data
const ACHIEVEMENTS = [
  // Academic Excellence
  {
    id: 'first-a',
    category: 'Academic Excellence',
    title: 'First A',
    description: 'Earn your first A grade',
    icon: Star,
    color: 'yellow',
    unlocked: true,
    progress: 100,
    maxProgress: 100,
    xpReward: 50,
    unlockedDate: '2024-09-15'
  },
  {
    id: 'straight-a',
    category: 'Academic Excellence',
    title: 'Straight A Student',
    description: 'Get A grades in all courses for one semester',
    icon: Award,
    color: 'purple',
    unlocked: false,
    progress: 2,
    maxProgress: 3,
    xpReward: 200
  },
  {
    id: 'perfect-score',
    category: 'Academic Excellence',
    title: 'Perfect Score',
    description: 'Score 100% on any assignment',
    icon: Target,
    color: 'red',
    unlocked: false,
    progress: 95,
    maxProgress: 100,
    xpReward: 100
  },
  // Consistency
  {
    id: 'week-streak',
    category: 'Consistency',
    title: '7 Day Streak',
    description: 'Study for 7 consecutive days',
    icon: Flame,
    color: 'orange',
    unlocked: true,
    progress: 7,
    maxProgress: 7,
    xpReward: 75,
    unlockedDate: '2024-10-10'
  },
  {
    id: 'month-streak',
    category: 'Consistency',
    title: '30 Day Streak',
    description: 'Study for 30 consecutive days',
    icon: Flame,
    color: 'red',
    unlocked: false,
    progress: 7,
    maxProgress: 30,
    xpReward: 300
  },
  {
    id: 'early-bird',
    category: 'Consistency',
    title: 'Early Bird',
    description: 'Submit 10 assignments before the deadline',
    icon: Rocket,
    color: 'blue',
    unlocked: false,
    progress: 6,
    maxProgress: 10,
    xpReward: 150
  },
  // Course Completion
  {
    id: 'first-module',
    category: 'Course Completion',
    title: 'First Module Complete',
    description: 'Complete your first course module',
    icon: CheckCircle,
    color: 'green',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    xpReward: 50,
    unlockedDate: '2024-09-05'
  },
  {
    id: 'course-master',
    category: 'Course Completion',
    title: 'Course Master',
    description: 'Complete 100% of a course',
    icon: Trophy,
    color: 'gold',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 500
  },
  {
    id: 'semester-complete',
    category: 'Course Completion',
    title: 'Semester Complete',
    description: 'Finish all courses in a semester',
    icon: GraduationCap,
    color: 'indigo',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    xpReward: 1000
  },
  // Engagement
  {
    id: 'quiz-master',
    category: 'Engagement',
    title: 'Quiz Master',
    description: 'Complete 20 quizzes',
    icon: Brain,
    color: 'purple',
    unlocked: false,
    progress: 8,
    maxProgress: 20,
    xpReward: 100
  },
  {
    id: 'flashcard-fan',
    category: 'Engagement',
    title: 'Flashcard Fan',
    description: 'Study with flashcards 50 times',
    icon: CreditCard,
    color: 'green',
    unlocked: false,
    progress: 23,
    maxProgress: 50,
    xpReward: 150
  },
  {
    id: 'ai-explorer',
    category: 'Engagement',
    title: 'AI Explorer',
    description: 'Use all AI study tools at least once',
    icon: Brain,
    color: 'blue',
    unlocked: false,
    progress: 3,
    maxProgress: 4,
    xpReward: 75
  },
  // Social
  {
    id: 'helpful-peer',
    category: 'Social',
    title: 'Helpful Peer',
    description: 'Help 5 classmates with questions',
    icon: Users,
    color: 'teal',
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    xpReward: 100
  },
  {
    id: 'discussion-leader',
    category: 'Social',
    title: 'Discussion Leader',
    description: 'Start 10 discussion threads',
    icon: MessageSquare,
    color: 'indigo',
    unlocked: false,
    progress: 4,
    maxProgress: 10,
    xpReward: 125
  }
];

export default function ACLEPlatform() {
  const [userRole, setUserRole] = useState<'student' | 'professor'>('student'); // Toggle between student and professor view
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [selectedAITool, setSelectedAITool] = useState<{materialId: string, toolType: string} | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState('fall-2024');
  const [activeCourseTab, setActiveCourseTab] = useState('home');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);

  // Modal interaction states
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [generatingTool, setGeneratingTool] = useState<string | null>(null); // Track which tool is being generated
  const [playingAudio, setPlayingAudio] = useState<string | null>(null); // Track which material's audio is playing
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null); // Store audio element reference

  // Reset modal state when modal closes
  useEffect(() => {
    if (!selectedAITool) {
      setFlippedCards(new Set());
      setCurrentCardIndex(0);
      setQuizAnswers({});
      setQuizSubmitted(false);
    }
  }, [selectedAITool]);

  // Global test function for debugging Gemini API
  useEffect(() => {
    (window as any).testGeminiAPI = async () => {
      console.log('🧪 Testing Gemini API...');
      const result = await callGeminiAPI('Generate 3 simple math flashcards. Return as JSON array with question and answer fields.');
      console.log('🧪 Test result:', result);
      return result;
    };
  }, []);

  // Shared course materials state - syncs between professor and student views
  const [courseMaterials, setCourseMaterials] = useState<any>({});

  // Student XP and achievements state for gamification
  const [studentXP, setStudentXP] = useState(STUDENT_DATA.xp);
  const [studentAchievements, setStudentAchievements] = useState(ACHIEVEMENTS);

  const showNotification = (message) => {
    setNotification(message);
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Firebase real-time listener for course materials
  useEffect(() => {
    console.log('Setting up Firebase listener for course materials...');

    // Hardcoded demo materials for Data Structures Week 1
    const hardcodedMaterials = {
      'dsa': [
        {
          id: 'hardcoded-dsa-algo-basics',
          courseId: 'dsa',
          name: 'Algorithm Basics.pdf',
          url: '#algorithm-basics-pdf',
          uploadedBy: 'Prof. Johnson',
          uploadedAt: new Date('2024-09-01'),
          aiContent: {
            audioUrl: 'data:audio/mp3;base64,mock-audio-data',
            audioNarration: 'Welcome to Algorithm Basics. Algorithms are step-by-step procedures for solving problems. An algorithm is a finite sequence of well-defined instructions that takes some input and produces an output. Understanding algorithms is fundamental to computer science. Key characteristics of good algorithms include correctness, ensuring the algorithm produces the right output for all valid inputs, efficiency in terms of time and space complexity, clarity so others can understand and maintain the code, and finiteness meaning the algorithm must terminate after a finite number of steps. Common algorithmic paradigms include divide and conquer, dynamic programming, greedy algorithms, and backtracking. As you study algorithms, you will develop problem-solving skills that extend far beyond programming.',
            flashcards: [
              { front: 'What is an algorithm?', back: 'A step-by-step procedure for solving a problem or performing a computation' },
              { front: 'What are the key characteristics of a good algorithm?', back: 'Correctness, Efficiency, Clarity, and Finiteness' },
              { front: 'What is algorithmic correctness?', back: 'An algorithm that produces the right output for all valid inputs' },
              { front: 'Name three common algorithmic paradigms', back: 'Divide and Conquer, Dynamic Programming, and Greedy Algorithms' },
              { front: 'What does finiteness mean for algorithms?', back: 'The algorithm must terminate after a finite number of steps' }
            ],
            quiz: [
              { question: 'Which is NOT a characteristic of a good algorithm?', options: ['Correctness', 'Efficiency', 'Ambiguity', 'Finiteness'], correctAnswer: 2 },
              { question: 'What is the primary goal of an algorithm?', options: ['To use memory', 'To solve a problem systematically', 'To write code', 'To create complexity'], correctAnswer: 1 },
              { question: 'Divide and Conquer is an example of:', options: ['A programming language', 'An algorithmic paradigm', 'A data structure', 'A compiler'], correctAnswer: 1 },
              { question: 'An algorithm must:', options: ['Be written in Python', 'Terminate after finite steps', 'Use recursion', 'Be complex'], correctAnswer: 1 }
            ],
            mindMap: {
              central: 'Algorithms',
              branches: [
                'Definition & Purpose',
                'Key Characteristics',
                'Correctness',
                'Efficiency',
                'Clarity',
                'Finiteness',
                'Algorithmic Paradigms',
                'Divide & Conquer',
                'Dynamic Programming',
                'Greedy Algorithms',
                'Problem Solving Skills',
                'Real-world Applications'
              ]
            },
            summary: 'Algorithm Basics introduces the fundamental concepts of algorithms in computer science. An algorithm is defined as a step-by-step procedure for solving problems, consisting of finite, well-defined instructions that transform inputs into outputs. Good algorithms exhibit four key characteristics: correctness (producing accurate results), efficiency (optimal use of time and space), clarity (understandable and maintainable code), and finiteness (guaranteed termination). The material covers major algorithmic paradigms including divide and conquer (breaking problems into subproblems), dynamic programming (storing solutions to avoid recomputation), greedy algorithms (making locally optimal choices), and backtracking (exploring all possible solutions). Understanding these fundamentals is essential for developing strong problem-solving skills applicable throughout computer science and software engineering.',
            keyTopics: [
              'Algorithm Definition',
              'Step-by-step Procedures',
              'Input and Output',
              'Correctness Principle',
              'Efficiency Metrics',
              'Code Clarity',
              'Finite Termination',
              'Divide and Conquer',
              'Dynamic Programming',
              'Greedy Algorithms',
              'Backtracking',
              'Problem-solving Skills'
            ]
          }
        },
        {
          id: 'hardcoded-dsa-bigo',
          courseId: 'dsa',
          name: 'Big O Notation Guide.pdf',
          url: '#bigo-notation-pdf',
          uploadedBy: 'Prof. Johnson',
          uploadedAt: new Date('2024-09-01'),
          aiContent: {
            audioUrl: 'data:audio/mp3;base64,mock-audio-data-bigo',
            audioNarration: 'Big O Notation is a mathematical notation used to describe the performance and complexity of algorithms. It specifically describes the worst-case scenario, helping us understand how an algorithm scales as input size grows. The O stands for order of magnitude. Common complexities include O of 1 for constant time, where execution time does not depend on input size. O of log n for logarithmic time, commonly seen in binary search. O of n for linear time, where time grows proportionally with input. O of n log n for linearithmic time, typical of efficient sorting algorithms like merge sort. O of n squared for quadratic time, seen in nested loops. And O of 2 to the n for exponential time, which becomes impractical for large inputs. Understanding Big O helps you choose the right algorithm and optimize your code effectively.',
            flashcards: [
              { front: 'What does Big O Notation measure?', back: 'The worst-case time or space complexity of an algorithm as input size grows' },
              { front: 'What is O(1) complexity?', back: 'Constant time - execution time does not depend on input size' },
              { front: 'What is O(log n) complexity?', back: 'Logarithmic time - time grows slowly as input increases, like binary search' },
              { front: 'What is O(n) complexity?', back: 'Linear time - time grows proportionally with input size' },
              { front: 'What is O(n²) complexity?', back: 'Quadratic time - time grows with the square of input size, common in nested loops' },
              { front: 'Which is faster: O(log n) or O(n)?', back: 'O(log n) is faster and more efficient' },
              { front: 'What complexity do efficient sorting algorithms like merge sort have?', back: 'O(n log n) - linearithmic time' }
            ],
            quiz: [
              { question: 'Which complexity is the fastest?', options: ['O(n)', 'O(1)', 'O(n²)', 'O(log n)'], correctAnswer: 1 },
              { question: 'Binary search has which time complexity?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctAnswer: 1 },
              { question: 'What does Big O describe?', options: ['Best case', 'Average case', 'Worst case', 'Random case'], correctAnswer: 2 },
              { question: 'Which is slowest for large inputs?', options: ['O(n)', 'O(log n)', 'O(2^n)', 'O(n log n)'], correctAnswer: 2 },
              { question: 'Nested loops typically indicate which complexity?', options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'], correctAnswer: 2 }
            ],
            mindMap: {
              central: 'Big O Notation',
              branches: [
                'Complexity Analysis',
                'Worst-case Performance',
                'O(1) Constant',
                'O(log n) Logarithmic',
                'O(n) Linear',
                'O(n log n) Linearithmic',
                'O(n²) Quadratic',
                'O(2^n) Exponential',
                'Algorithm Comparison',
                'Optimization Strategies',
                'Space Complexity',
                'Time Complexity'
              ]
            },
            summary: 'Big O Notation Guide provides a comprehensive introduction to analyzing algorithm complexity. Big O notation mathematically describes how an algorithm\'s performance scales with input size, focusing on worst-case scenarios. The guide covers fundamental complexity classes: O(1) constant time operations that execute in fixed time regardless of input; O(log n) logarithmic operations like binary search that divide the problem space; O(n) linear operations that process each element once; O(n log n) linearithmic operations typical of efficient sorting algorithms; O(n²) quadratic operations with nested iterations; and O(2^n) exponential operations that become impractical quickly. Understanding these complexities enables developers to compare algorithms objectively, identify performance bottlenecks, and make informed decisions about algorithm selection and optimization. The notation provides a language-agnostic way to discuss efficiency, making it essential for technical interviews and system design.',
            keyTopics: [
              'Big O Definition',
              'Complexity Measurement',
              'Worst-case Analysis',
              'Constant Time O(1)',
              'Logarithmic Time O(log n)',
              'Linear Time O(n)',
              'Linearithmic O(n log n)',
              'Quadratic O(n²)',
              'Exponential O(2^n)',
              'Algorithm Comparison',
              'Performance Optimization',
              'Space vs Time Tradeoffs'
            ]
          }
        }
      ]
    };

    const materialsRef = collection(db, 'courseMaterials');
    const unsubscribe = onSnapshot(materialsRef, (snapshot) => {
      const materialsByCourse: any = {};

      snapshot.docs.forEach((doc) => {
        const material = { id: doc.id, ...doc.data() };
        const courseId = material.courseId;

        if (!materialsByCourse[courseId]) {
          materialsByCourse[courseId] = [];
        }
        materialsByCourse[courseId].push(material);
      });

      // Merge hardcoded materials with Firebase materials
      Object.keys(hardcodedMaterials).forEach(courseId => {
        if (!materialsByCourse[courseId]) {
          materialsByCourse[courseId] = [];
        }
        // Add hardcoded materials that don't already exist
        hardcodedMaterials[courseId].forEach(hardcodedMat => {
          const exists = materialsByCourse[courseId].some(mat => mat.id === hardcodedMat.id);
          if (!exists) {
            materialsByCourse[courseId].push(hardcodedMat);
          }
        });
      });

      // Sort materials by upload date (newest first)
      Object.keys(materialsByCourse).forEach(courseId => {
        materialsByCourse[courseId].sort((a, b) => {
          const dateA = a.uploadedAt?.toDate ? a.uploadedAt.toDate() : new Date(a.uploadedAt);
          const dateB = b.uploadedAt?.toDate ? b.uploadedAt.toDate() : new Date(b.uploadedAt);
          return dateB.getTime() - dateA.getTime();
        });
      });

      console.log('Firebase materials updated:', materialsByCourse);
      console.log('🔍 DSA materials:', materialsByCourse['dsa']);
      if (materialsByCourse['dsa']) {
        materialsByCourse['dsa'].forEach((mat: any) => {
          console.log('  📄 Material:', mat.name, '| Has AI Content:', !!mat.aiContent, '| Has audioUrl:', !!mat.aiContent?.audioUrl);
        });
      }
      setCourseMaterials(materialsByCourse);
    }, (error) => {
      console.error('Firebase listener error:', error);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const openCourse = (course) => {
    setSelectedCourse(course);
    setCurrentPage('course');
  };

  const openModule = (module) => {
    setSelectedModule(module);
    setCurrentPage('module');
  };

  const openTool = (tool) => {
    setSelectedTool(tool);
    setCurrentPage('tool');
  };

  const openMaterial = (material) => {
    setSelectedMaterial(material);
    setCurrentPage('material');
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-indigo-600',
      green: 'from-green-500 to-emerald-600',
      purple: 'from-purple-500 to-pink-600',
      red: 'from-red-500 to-rose-600',
      orange: 'from-orange-500 to-amber-600',
      indigo: 'from-indigo-500 to-blue-600'
    };
    return colors[color] || colors.blue;
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'text-green-600 bg-green-50',
      'in-progress': 'text-blue-600 bg-blue-50',
      available: 'text-yellow-600 bg-yellow-50',
      locked: 'text-gray-500 bg-gray-50'
    };
    return colors[status] || colors.available;
  };

  // AI processing for uploaded materials using Gemini API (NotebookLM-style)
  const processWithAI = async (fileName: string, fileType: string, fileUrl: string, fileContent?: string, fileBase64?: string) => {
    setAiProcessing(true);

    try {
      console.log(`🤖 AI Processing started for: ${fileName}`);
      console.log(`📄 File type: ${fileType}`);
      console.log(`🔗 File URL: ${fileUrl}`);
      console.log(`📝 Text content: ${fileContent ? 'Yes (' + fileContent.length + ' chars)' : 'No'}`);
      console.log(`🖼️ Base64 content: ${fileBase64 ? 'Yes (' + fileBase64.length + ' chars)' : 'No'}`);

      // Extract topic from filename for better prompts
      const topic = fileName.replace(/\.[^/.]+$/, '').replace(/-|_/g, ' ');

      // Build context string from file content
      const contentContext = fileContent
        ? `\n\nHere is the actual content from the file:\n\n${fileContent.substring(0, 50000)}\n\nUse this content to generate accurate, specific study materials.`
        : fileBase64
        ? `\n\nI'm providing you with the file content as a ${fileType.includes('pdf') ? 'PDF document' : 'image'}. Analyze it thoroughly and extract all key information to generate comprehensive study materials.`
        : `\n\nNote: File content is not directly accessible. Generate comprehensive study materials based on the topic "${topic}".`;

      // Generate COMPREHENSIVE flashcards using Gemini (unlimited)
      const flashcardsPrompt = `You are an expert educational content creator. Analyze the document titled "${fileName}" about "${topic}".${contentContext}

Generate a comprehensive set of flashcards covering ALL important concepts, definitions, formulas, examples, and key points from this material. Create as many flashcards as needed to thoroughly cover the content (minimum 10-30 flashcards depending on content depth).

For each flashcard:
- Front: A clear, specific question or prompt
- Back: A detailed, complete answer with explanations

Format as a JSON array:
[
  {"question": "What is...", "answer": "Detailed explanation..."},
  {"question": "How does...", "answer": "Step-by-step explanation..."}
]

Make the flashcards progressively cover: basic definitions, intermediate concepts, advanced applications, examples, and edge cases.`;

      const flashcardsResponse = await callGeminiAPI(flashcardsPrompt, fileBase64, fileType);
      let flashcards = [];

      if (flashcardsResponse) {
        console.log('🎯 Flashcards API response received');
        try {
          const jsonMatch = flashcardsResponse.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            flashcards = JSON.parse(jsonMatch[0]);
            console.log(`✅ Successfully parsed ${flashcards.length} AI-generated flashcards from API`);
          } else {
            console.warn('⚠️ No JSON array found in flashcards response');
          }
        } catch (e) {
          console.error('❌ Failed to parse flashcards JSON:', e);
        }
      } else {
        console.warn('⚠️ Flashcards API returned null - will use fallback data');
      }

      // Fallback to comprehensive mock data if API fails (15-20 cards)
      if (flashcards.length === 0) {
        console.warn('🔄 Using fallback flashcards data');
        flashcards = [
          { question: `What is ${topic}?`, answer: `${topic} is a fundamental concept that involves understanding key principles and their practical applications in problem-solving. It forms the foundation for advanced study in this area.` },
          { question: `What are the main components of ${topic}?`, answer: `The main components include theoretical foundations, practical implementations, and real-world applications that work together to form a comprehensive understanding.` },
          { question: `How is ${topic} used in practice?`, answer: `In practice, ${topic} is applied to solve complex problems efficiently through systematic approaches and proven methodologies, often integrated into larger systems.` },
          { question: `What are the key benefits of understanding ${topic}?`, answer: `Understanding ${topic} enables better problem-solving, improved efficiency, deeper comprehension of related concepts, and the ability to innovate in the field.` },
          { question: `What are common challenges with ${topic}?`, answer: `Common challenges include understanding complex interactions, optimizing performance, applying concepts correctly in different contexts, and managing trade-offs.` },
          { question: `What prerequisites are needed for ${topic}?`, answer: `Prerequisites typically include foundational knowledge in related areas, basic problem-solving skills, analytical thinking, and familiarity with core concepts.` },
          { question: `How does ${topic} relate to other concepts?`, answer: `${topic} builds upon and connects to various related concepts, forming an integrated framework of understanding that spans multiple domains.` },
          { question: `What are advanced applications of ${topic}?`, answer: `Advanced applications include optimization techniques, complex system design, innovative problem-solving approaches, and cutting-edge research implementations.` },
          { question: `What are best practices for ${topic}?`, answer: `Best practices involve systematic analysis, careful implementation, thorough testing, continuous refinement of approaches, and staying current with developments.` },
          { question: `What common mistakes should be avoided with ${topic}?`, answer: `Common mistakes include oversimplification, ignoring edge cases, not considering scalability and efficiency, and failing to validate assumptions.` },
          { question: `What tools or frameworks support ${topic}?`, answer: `Various specialized tools and frameworks have been developed to support ${topic}, each with specific use cases and advantages.` },
          { question: `How do you evaluate success with ${topic}?`, answer: `Success is evaluated through measurable outcomes, performance metrics, quality assessments, and the achievement of specific objectives.` },
          { question: `What are the theoretical foundations of ${topic}?`, answer: `The theoretical foundations rest on established principles, proven methodologies, mathematical models, and empirical research findings.` },
          { question: `How has ${topic} evolved over time?`, answer: `${topic} has evolved through continuous research, practical refinements, technological advances, and the integration of new insights and approaches.` },
          { question: `What future developments are expected in ${topic}?`, answer: `Future developments include enhanced methodologies, integration with emerging technologies, new applications, and continued theoretical advancement.` }
        ];
        console.log(`⚠️ Using fallback: ${flashcards.length} flashcards`);
      }

      // Generate COMPREHENSIVE quiz questions using Gemini (unlimited)
      const quizPrompt = `You are an expert assessment creator. Based on the document "${fileName}" about "${topic}", create a comprehensive quiz that thoroughly tests understanding.${contentContext}

Generate 10-20 multiple choice questions covering:
- Basic concepts and definitions
- Application of principles
- Analysis and evaluation
- Problem-solving scenarios
- Edge cases and exceptions

Each question should have:
- A clear, specific question
- 4 plausible options
- The index (0-3) of the correct answer
- Questions should range from easy to difficult

Format as JSON:
[
  {
    "question": "Clear question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 1
  }
]`;

      const quizResponse = await callGeminiAPI(quizPrompt, fileBase64, fileType);
      let quiz = [];

      if (quizResponse) {
        console.log('🎯 Quiz API response received');
        try {
          const jsonMatch = quizResponse.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            quiz = JSON.parse(jsonMatch[0]);
            console.log(`✅ Successfully parsed ${quiz.length} AI-generated quiz questions from API`);
          } else {
            console.warn('⚠️ No JSON array found in quiz response');
          }
        } catch (e) {
          console.error('❌ Failed to parse quiz JSON:', e);
        }
      } else {
        console.warn('⚠️ Quiz API returned null - will use fallback data');
      }

      if (quiz.length === 0) {
        console.warn('🔄 Using fallback quiz data');
        quiz = [
          { question: `What is the primary focus of ${topic}?`, options: ['Basic understanding', 'Advanced applications', 'Comprehensive mastery', 'All of the above'], correctAnswer: 3 },
          { question: `Which best describes ${topic}?`, options: ['Simple concept', 'Complex framework', 'Basic tool', 'Advanced methodology'], correctAnswer: 1 },
          { question: `How should ${topic} be approached?`, options: ['Randomly', 'Systematically', 'Superficially', 'Theoretically only'], correctAnswer: 1 },
          { question: `What is a key characteristic of ${topic}?`, options: ['Complexity and depth', 'Simplicity only', 'Irrelevance', 'Obsolescence'], correctAnswer: 0 },
          { question: `When is ${topic} most useful?`, options: ['Never applicable', 'Rarely needed', 'In specific contexts', 'Universally applicable'], correctAnswer: 2 },
          { question: `What skills are developed through ${topic}?`, options: ['No new skills', 'Basic skills', 'Advanced problem-solving', 'Memorization only'], correctAnswer: 2 },
          { question: `How does ${topic} compare to related concepts?`, options: ['Completely different', 'Closely related and interconnected', 'Unrelated', 'Exactly identical'], correctAnswer: 1 },
          { question: `What is the expected outcome of studying ${topic}?`, options: ['Confusion', 'Basic awareness', 'Deep understanding and mastery', 'Frustration'], correctAnswer: 2 },
          { question: `Which approach works best with ${topic}?`, options: ['Rote memorization', 'Practical application with understanding', 'Passive reading', 'Theory without practice'], correctAnswer: 1 },
          { question: `What makes ${topic} important?`, options: ['Historical interest only', 'Current relevance', 'Future potential', 'All of these combined'], correctAnswer: 3 },
          { question: `Which statement about ${topic} is most accurate?`, options: ['Simple and straightforward', 'Requires dedicated study', 'Not worth learning', 'Only for experts'], correctAnswer: 1 },
          { question: `What is essential for mastering ${topic}?`, options: ['Luck', 'Practice and application', 'Natural talent only', 'Avoiding challenges'], correctAnswer: 1 },
          { question: `How does ${topic} contribute to professional development?`, options: ['No contribution', 'Minor benefit', 'Significant skillset enhancement', 'Irrelevant'], correctAnswer: 2 },
          { question: `What level of engagement is needed for ${topic}?`, options: ['Minimal', 'Passive observation', 'Active participation and critical thinking', 'None'], correctAnswer: 2 },
          { question: `Which best represents the scope of ${topic}?`, options: ['Very narrow', 'Limited application', 'Broad and multifaceted', 'Undefined'], correctAnswer: 2 }
        ];
        console.log(`⚠️ Using fallback: ${quiz.length} quiz questions`);
      }

      // Generate COMPREHENSIVE mind map using Gemini
      const mindMapPrompt = `You are a visual learning expert. For the document "${fileName}" about "${topic}", create a comprehensive mind map structure.${contentContext}

The mind map should have:
- 1 central concept (the main topic)
- 8-12 main branches (major subtopics, themes, or categories)
- Each branch should represent a significant aspect of the content

Format as JSON:
{
  "central": "Main Central Topic",
  "branches": [
    "Major Subtopic 1",
    "Major Subtopic 2",
    ...
  ]
}`;

      const mindMapResponse = await callGeminiAPI(mindMapPrompt, fileBase64, fileType);
      let mindMap: { central: string; branches: string[] } = { central: '', branches: [] };

      if (mindMapResponse) {
        console.log('🎯 Mind Map API response received');
        try {
          const jsonMatch = mindMapResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            mindMap = JSON.parse(jsonMatch[0]);
            console.log(`✅ Successfully parsed AI-generated mind map with ${mindMap.branches?.length || 0} branches from API`);
          } else {
            console.warn('⚠️ No JSON object found in mind map response');
          }
        } catch (e) {
          console.error('❌ Failed to parse mind map JSON:', e);
        }
      } else {
        console.warn('⚠️ Mind Map API returned null - will use fallback data');
      }

      if (!mindMap.central) {
        console.warn('🔄 Using fallback mind map data');
        mindMap = {
          central: topic,
          branches: [
            'Fundamental Concepts',
            'Core Principles',
            'Key Components',
            'Practical Applications',
            'Advanced Topics',
            'Best Practices',
            'Common Challenges',
            'Real-World Examples',
            'Related Concepts',
            'Future Directions'
          ]
        };
        console.log(`⚠️ Using fallback mind map`);
      }

      // Generate COMPREHENSIVE summary using Gemini
      const summaryPrompt = `You are a content summarization expert. Analyze the document "${fileName}" about "${topic}".${contentContext}

Provide a detailed, comprehensive summary (200-300 words) that covers:
- Main themes and objectives
- Key concepts and principles
- Important details and examples
- Practical applications
- Significance and relevance

Write in clear, engaging prose suitable for students.`;

      const summaryResponse = await callGeminiAPI(summaryPrompt, fileBase64, fileType);
      const summary = summaryResponse || `This comprehensive material on ${topic} explores fundamental concepts, practical applications, and advanced methodologies. The content provides students with a thorough understanding of key principles, detailed examples, and real-world applications. Through systematic exploration of core ideas, students develop critical thinking skills and problem-solving abilities. The material bridges theoretical foundations with practical implementations, preparing learners for advanced study and professional application. Key insights include understanding fundamental mechanisms, recognizing patterns, and applying knowledge to novel situations.`;
      console.log(`✅ Generated summary (${summary.length} chars)`);

      // Generate COMPREHENSIVE key topics
      const topicsPrompt = `You are a curriculum designer. For the document "${fileName}" about "${topic}", identify 8-15 key topics or learning objectives that students should master.${contentContext}

List specific, actionable topics that represent the core learning goals.

Format as a JSON array of strings:
["Topic 1", "Topic 2", ...]`;

      const topicsResponse = await callGeminiAPI(topicsPrompt, fileBase64, fileType);
      let keyTopics = [];

      if (topicsResponse) {
        try {
          const jsonMatch = topicsResponse.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            keyTopics = JSON.parse(jsonMatch[0]);
            console.log(`✅ Generated ${keyTopics.length} key topics`);
          }
        } catch (e) {
          console.error('Failed to parse topics:', e);
        }
      }

      if (keyTopics.length === 0) {
        keyTopics = [
          'Core Definitions and Terminology',
          'Fundamental Principles',
          'Key Methodologies',
          'Practical Applications',
          'Problem-Solving Techniques',
          'Advanced Concepts',
          'Real-World Examples',
          'Best Practices and Guidelines',
          'Common Pitfalls to Avoid',
          'Integration with Related Topics'
        ];
        console.log(`⚠️ Using fallback: ${keyTopics.length} topics`);
      }

      // Generate TTS Audio Narration (30-45 seconds)
      console.log('🎙️ Step 6: Generating TTS audio narration...');

      // Create a concise narration script (150-200 words for ~45 seconds)
      const narrationPrompt = `You are a friendly educational narrator. Create a concise, engaging 150-200 word narration script about "${topic}" based on this summary: "${summary}".

The narration should:
- Be conversational and motivational
- Highlight 3-4 key takeaways
- Be exactly 150-200 words (for 45 seconds of speech)
- Start with: "Welcome! Let's explore ${topic}..."
- End with an encouraging note

Write ONLY the narration script, no extra text.`;

      const narrationScript = await callGeminiAPI(narrationPrompt, fileBase64, fileType);
      let audioUrl: string | null = null;

      if (narrationScript) {
        console.log('📝 Narration script generated:', narrationScript.substring(0, 100) + '...');

        // Generate TTS audio from narration script
        const audioBase64 = await generateTTSAudio(narrationScript);

        if (audioBase64) {
          try {
            // Upload audio to Firebase Storage
            console.log('☁️ Uploading audio to Firebase Storage...');
            const audioFileName = `${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}-narration.mp3`;
            const audioStorageRef = ref(storage, `course-audio/${selectedCourse?.id || 'general'}/${audioFileName}`);

            // Convert base64 to blob
            const audioBlob = await fetch(`data:audio/mp3;base64,${audioBase64}`).then(r => r.blob());

            await uploadBytes(audioStorageRef, audioBlob);
            audioUrl = await getDownloadURL(audioStorageRef);
            console.log('✅ Audio uploaded successfully:', audioUrl);
          } catch (uploadError) {
            console.error('❌ Failed to upload audio to Storage:', uploadError);
          }
        }
      } else {
        console.warn('⚠️ Failed to generate narration script, skipping TTS');
      }

      const aiGeneratedContent = {
        flashcards,
        quiz,
        mindMap,
        keyTopics,
        summary,
        audioUrl  // Add audio URL to AI content
      };

      // Award XP for AI content generation
      setStudentXP(prev => prev + 10);
      showNotification('✓ Earned 10 XP for new study materials!');

      setAiProcessing(false);
      return aiGeneratedContent;

    } catch (error) {
      console.error('AI processing error:', error);
      setAiProcessing(false);

      // Return fallback mock data
      return {
        flashcards: [
          { front: `Key concept from ${fileName}`, back: 'AI-generated explanation' },
          { front: 'Important definition', back: 'Auto-extracted from content' }
        ],
        quiz: [
          { question: `What is the main topic of ${fileName}?`, options: ['A', 'B', 'C', 'D'], correct: 0 }
        ],
        mindMap: {
          central: fileName.replace(/\.[^/.]+$/, ''),
          branches: ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4']
        },
        keyTopics: ['Topic A', 'Topic B', 'Topic C'],
        summary: `AI-generated summary of ${fileName}...`
      };
    }
  };

  // Generate ALL AI content when student first clicks any tool (calls processWithAI)
  const generateAllAIContent = async (material: any) => {
    console.log(`🎯 Generating ALL AI content for:`, material.name);
    setGeneratingTool('all');

    try {
      // Download file from Storage and convert to base64 if needed (for PDFs/images)
      let fileBase64: string | null = null;
      if (material.type.includes('pdf') || material.type.includes('image')) {
        console.log('📥 Downloading file from Storage to convert to base64...');
        // Fetch the file from the download URL
        const response = await fetch(material.url);
        const blob = await response.blob();

        // Convert blob to base64
        fileBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            resolve(base64.split(',')[1]); // Remove data:image/png;base64, prefix
          };
          reader.readAsDataURL(blob);
        });
        console.log('✅ File downloaded and converted to base64, length:', fileBase64.length);
      }

      const aiContent = await processWithAI(
        material.name,
        material.type,
        material.url,
        material.fileContent || undefined,
        fileBase64 || undefined
      );

      // Update Firestore with all AI content
      if (material.id) {
        const materialRef = doc(db, 'courseMaterials', material.id);
        await updateDoc(materialRef, { aiContent });
        console.log(`✅ Saved all AI content to Firestore`);
      }

      setGeneratingTool(null);
      showNotification('✓ AI study tools generated successfully!');
      return aiContent;
    } catch (error) {
      console.error(`❌ Error generating AI content:`, error);
      setGeneratingTool(null);
      showNotification('❌ Error generating AI content');
      return null;
    }
  };

  // Handle audio playback using Text-to-Speech
  const handlePlayAudio = (materialId: string, _audioUrl?: string, narrationText?: string) => {
    console.log('🔊 handlePlayAudio called for material:', materialId);

    // If already playing this audio, stop it
    if (playingAudio === materialId) {
      console.log('⏹️ Stopping currently playing audio');
      window.speechSynthesis.cancel();
      if (audioElement) {
        audioElement.pause();
      }
      setPlayingAudio(null);
      setAudioElement(null);
      showNotification('⏹️ Audio stopped');
      return;
    }

    // Stop any currently playing audio
    window.speechSynthesis.cancel();
    if (audioElement) {
      audioElement.pause();
    }

    // Find the material to get narration text
    const material: any = Object.values(courseMaterials)
      .flat()
      .find((mat: any) => mat.id === materialId);

    console.log('📄 Found material:', material?.name);
    console.log('📝 AI Content:', material?.aiContent ? 'Available' : 'Not available');

    const textToSpeak = material?.aiContent?.audioNarration || narrationText || 'Audio narration is not available for this material.';

    console.log('🗣️ Text to speak (first 100 chars):', textToSpeak.substring(0, 100));
    console.log('📏 Text length:', textToSpeak.length, 'characters');

    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      console.error('❌ Speech synthesis not supported in this browser');
      showNotification('❌ Text-to-speech not supported in your browser');
      return;
    }

    // Use Web Speech API for text-to-speech
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      console.log('✅ Speech started successfully');
      setPlayingAudio(materialId);
      showNotification('🎵 Playing audio narration');
    };

    utterance.onend = () => {
      console.log('✅ Speech ended');
      setPlayingAudio(null);
      setAudioElement(null);
      showNotification('✅ Audio narration completed');
    };

    utterance.onerror = (error) => {
      console.error('❌ Speech synthesis error:', error);
      showNotification('❌ Failed to play audio: ' + error.error);
      setPlayingAudio(null);
    };

    console.log('🎬 Starting speech synthesis...');
    window.speechSynthesis.speak(utterance);
    console.log('🎬 Speech synthesis command sent');
  };

  // Professor Dashboard
  const ProfessorDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg shadow-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {PROFESSOR_DATA.name}!</h1>
          <p className="text-purple-100 text-lg mb-4">{PROFESSOR_DATA.department}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Courses</p>
                <p className="text-3xl font-bold text-purple-600">{PROFESSOR_DATA.courses.length}</p>
              </div>
              <BookOpen className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-blue-600">
                  {PROFESSOR_DATA.courses.reduce((sum, c) => sum + c.enrolledStudents, 0)}
                </p>
              </div>
              <Users className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Semester</p>
                <p className="text-2xl font-bold text-green-600">Fall 2024</p>
              </div>
              <Calendar className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* My Courses */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">My Courses</h2>
          </div>
          <div className="p-6 space-y-4">
            {PROFESSOR_DATA.courses.map(course => (
              <div
                key={course.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedCourse(course);
                  setCurrentPage('professor-course');
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${course.color}-500`}></div>
                      <div>
                        <h3 className="font-bold text-lg">{course.code} - {course.title}</h3>
                        <p className="text-gray-600 text-sm">{course.semester}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{course.enrolledStudents}</p>
                      <p className="text-xs text-gray-600">Students</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Professor Course Management Page
  const ProfessorCoursePage = () => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [newAssignment, setNewAssignment] = useState({
      title: '',
      dueDate: '',
      points: 100,
      description: ''
    });

    const handleDeleteMaterial = async (material: any) => {
      if (!window.confirm(`Are you sure you want to delete "${material.name}"? This action cannot be undone.`)) {
        return;
      }

      try {
        console.log('🗑️ Deleting material:', material.name);

        // Delete from Firestore
        await deleteDoc(doc(db, 'courseMaterials', material.id));
        console.log('✅ Deleted from Firestore');

        showNotification(`✓ "${material.name}" deleted successfully`);
      } catch (error: any) {
        console.error('❌ Error deleting material:', error);
        showNotification(`❌ Error deleting material: ${error?.message || 'Unknown error'}`);
      }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          setSelectedFile(file);
          setUploadingFile(true);

          console.log('🔵 Starting file upload to Firebase...', file.name, `(${file.type})`);

          // 1. Read file content for AI processing (text, PDF, or image)
          let fileContent = '';
          let fileBase64 = '';

          if (file.type.includes('text') || file.type.includes('json')) {
            // Text files - read as text
            fileContent = await file.text();
            console.log('📄 Text content extracted:', fileContent.substring(0, 200) + '...');
          } else if (file.type.includes('pdf') || file.type.includes('image')) {
            // PDF or Image - convert to base64 for Gemini
            const reader = new FileReader();
            fileBase64 = await new Promise((resolve) => {
              reader.onload = () => {
                const base64 = reader.result as string;
                resolve(base64.split(',')[1]); // Remove data:image/png;base64, prefix
              };
              reader.readAsDataURL(file);
            });
            console.log('🖼️ File converted to base64, length:', fileBase64.length);
          }

          // 2. Upload file to Firebase Storage
          const timestamp = Date.now();
          const fileRef = ref(storage, `course-materials/${selectedCourse?.id}/${timestamp}-${file.name}`);

          console.log('☁️ Uploading to Firebase Storage...');
          const uploadResult = await uploadBytes(fileRef, file);
          console.log('✅ File uploaded to storage');

          // 3. Get download URL
          const fileUrl = await getDownloadURL(fileRef);
          console.log('🔗 Download URL obtained');

          // 4. Save to Firestore (NO AI processing yet - will generate on-demand when student clicks)
          // We don't store base64 - we'll download the file from Storage when needed for AI
          const materialData = {
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: Timestamp.now(),
            uploadedBy: PROFESSOR_DATA.name,
            url: fileUrl,
            fileContent: fileContent || null,  // Store text content if small enough
            aiContent: null,                   // Will be generated on-demand
            courseId: selectedCourse?.id,
            courseName: selectedCourse?.title,
            courseCode: selectedCourse?.code
          };

          console.log('💾 Saving to Firestore (no AI processing yet)...', { name: file.name, hasContent: !!fileContent });
          const docRef = await addDoc(collection(db, 'courseMaterials'), materialData);
          console.log('✅ Material saved to Firestore with ID:', docRef.id);

          showNotification(`✓ ${file.name} uploaded successfully!`);
          setUploadingFile(false);
          setShowUploadModal(false);
          setSelectedFile(null);

        } catch (error) {
          console.error('Error uploading file:', error);
          showNotification(`❌ Error uploading file: ${error.message}`);
          setUploadingFile(false);
        }
      }
    };

    const handleCreateAssignment = () => {
      showNotification(`✓ Assignment "${newAssignment.title}" created and added to calendar!`);
      setShowAssignmentModal(false);
      setNewAssignment({ title: '', dueDate: '', points: 100, description: '' });
    };

    return (
      <div className="space-y-6">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{selectedCourse?.code} - {selectedCourse?.title}</h1>
              <p className="text-gray-600">{selectedCourse?.enrolledStudents} enrolled students</p>
            </div>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <FileText className="h-8 w-8 mb-2" />
            <h3 className="font-bold text-lg">Upload Material</h3>
            <p className="text-sm text-blue-100">PDF, Slides, Documents</p>
          </button>

          <button
            onClick={() => setShowAssignmentModal(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <Calendar className="h-8 w-8 mb-2" />
            <h3 className="font-bold text-lg">Create Assignment</h3>
            <p className="text-sm text-green-100">Auto-add to calendar</p>
          </button>

          <button
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <Brain className="h-8 w-8 mb-2" />
            <h3 className="font-bold text-lg">AI Analytics</h3>
            <p className="text-sm text-purple-100">Student insights</p>
          </button>
        </div>

        {/* Upload Material Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Upload Course Material</h2>
                <button onClick={() => setShowUploadModal(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Select File</label>
                  <input
                    type="file"
                    accept=".pdf,.pptx,.docx"
                    onChange={handleFileUpload}
                    className="w-full border rounded-lg p-2"
                  />
                  <p className="text-sm text-gray-600 mt-2">Supported: PDF, PowerPoint, Word</p>
                </div>

                {aiProcessing && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <div>
                        <p className="font-bold text-blue-900">AI Processing...</p>
                        <p className="text-sm text-blue-700">Generating flashcards, quizzes, and mind maps</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-bold mb-3 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-600" />
                    AI Will Automatically Generate:
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Flashcards from key concepts
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Practice quizzes with multiple choice questions
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Mind maps of topic relationships
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Study guide summaries
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Key topic extraction
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Assignment Modal */}
        {showAssignmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Create Assignment</h2>
                <button onClick={() => setShowAssignmentModal(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Assignment Title</label>
                  <input
                    type="text"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    className="w-full border rounded-lg p-2"
                    placeholder="e.g., Project 2: Binary Search Trees"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Due Date</label>
                    <input
                      type="date"
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Points</label>
                    <input
                      type="number"
                      value={newAssignment.points}
                      onChange={(e) => setNewAssignment({...newAssignment, points: parseInt(e.target.value)})}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                    className="w-full border rounded-lg p-2 h-24"
                    placeholder="Assignment details..."
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-bold mb-2 flex items-center text-green-900">
                    <Calendar className="h-5 w-5 mr-2 text-green-600" />
                    Automatic Features:
                  </h3>
                  <ul className="space-y-1 text-sm text-green-800">
                    <li>✓ Added to student calendars automatically</li>
                    <li>✓ Email notifications sent to all students</li>
                    <li>✓ Deadline reminders scheduled</li>
                    <li>✓ Appears in course assignments tab</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleCreateAssignment}
                    className="flex-1 bg-green-600 text-white rounded-lg py-3 font-bold hover:bg-green-700"
                  >
                    Create Assignment
                  </button>
                  <button
                    onClick={() => setShowAssignmentModal(false)}
                    className="px-6 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Course Modules - Week by Week */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Course Modules</h2>
          </div>
          <div className="p-6">
            {selectedCourse?.modules && selectedCourse.modules.length > 0 ? (
              <div className="space-y-4">
                {selectedCourse.modules.map((module: any) => {
                  const isCompleted = module.status === 'completed';
                  const isInProgress = module.status === 'in-progress';
                  const isAvailable = module.status === 'available';
                  const isLocked = module.status === 'locked';

                  return (
                    <div
                      key={module.id}
                      className={`border-2 rounded-lg overflow-hidden transition-shadow ${
                        isCompleted ? 'bg-green-50 border-green-300' :
                        isInProgress ? 'bg-blue-50 border-blue-300' :
                        isAvailable ? 'bg-yellow-50 border-yellow-300' :
                        'bg-gray-50 border-gray-300 opacity-60'
                      }`}
                    >
                      <div
                        className={`p-4 border-b cursor-pointer ${
                          isCompleted ? 'bg-green-100' :
                          isInProgress ? 'bg-blue-100' :
                          isAvailable ? 'bg-yellow-100' :
                          'bg-gray-100 cursor-not-allowed'
                        }`}
                        onClick={() => !isLocked && openModule(module)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            {isCompleted && <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />}
                            {isInProgress && <Play className="h-6 w-6 text-blue-600 flex-shrink-0" />}
                            {isAvailable && <div className="w-6 h-6 rounded-full border-2 border-yellow-600 flex-shrink-0" />}
                            {isLocked && <Lock className="h-6 w-6 text-gray-400 flex-shrink-0" />}

                            <div className="flex-1">
                              <h3 className="font-bold text-lg">Week {module.week}: {module.title}</h3>
                              <div className="flex items-center gap-4 mt-2 flex-wrap">
                                {!isLocked && (
                                  <div className="flex items-center gap-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full ${
                                          isCompleted ? 'bg-green-600' :
                                          isInProgress ? 'bg-blue-600' :
                                          'bg-yellow-600'
                                        }`}
                                        style={{ width: `${module.completion}%` }}
                                      />
                                    </div>
                                    <span className={`text-sm font-semibold ${
                                      isCompleted ? 'text-green-700' :
                                      isInProgress ? 'text-blue-700' :
                                      'text-yellow-700'
                                    }`}>
                                      {module.completion}%
                                    </span>
                                  </div>
                                )}
                                <span className="text-sm text-gray-600">
                                  {module.materials?.length || 0} materials
                                </span>
                                {module.xp && (
                                  <span className="text-sm text-gray-600">
                                    +{module.xp} XP
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {isInProgress && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModule(module);
                                }}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                              >
                                Continue
                              </button>
                            )}
                            {isAvailable && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModule(module);
                                }}
                                className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 font-semibold"
                              >
                                Start
                              </button>
                            )}
                            {!isLocked && <ChevronRight className="h-5 w-5 text-gray-400" />}
                          </div>
                        </div>
                      </div>

                      {/* Module Materials Preview */}
                      {module.materials && module.materials.length > 0 && (
                        <div className="p-4 bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {module.materials.map((material: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                                {material.type === 'slides' && <FileText className="h-4 w-4 text-orange-600 flex-shrink-0" />}
                                {material.type === 'video' && <Video className="h-4 w-4 text-red-600 flex-shrink-0" />}
                                {material.type === 'pdf' && <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{material.title}</p>
                                  {material.duration && (
                                    <p className="text-xs text-gray-500">{material.duration}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>No modules available yet</p>
                <p className="text-sm">Check back later for course modules</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Dashboard Page
  const DashboardPage = () => {
    const filteredCourses = STUDENT_DATA.courses.filter(course => course.semester === selectedSemester);
    const currentSemesterData = STUDENT_DATA.semesters.find(s => s.id === selectedSemester);

    return (
      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {STUDENT_DATA.name}!</h1>
          <p className="text-blue-100 text-lg mb-4">{STUDENT_DATA.major}</p>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <Zap className="h-6 w-6 mb-2" />
              <div className="text-2xl font-bold">{STUDENT_DATA.xp}</div>
              <div className="text-sm opacity-90">Total XP</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <BookOpen className="h-6 w-6 mb-2" />
              <div className="text-2xl font-bold">{filteredCourses.length}</div>
              <div className="text-sm opacity-90">{currentSemesterData?.isCurrent ? 'Active Courses' : 'Completed Courses'}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <Flame className="h-6 w-6 mb-2" />
              <div className="text-2xl font-bold">{STUDENT_DATA.streak}</div>
              <div className="text-sm opacity-90">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Semester Filter Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Semester</h2>
          <div className="flex flex-wrap gap-3">
            {STUDENT_DATA.semesters.map(semester => (
              <button
                key={semester.id}
                onClick={() => setSelectedSemester(semester.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedSemester === semester.id
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {semester.name}
                {semester.isCurrent && (
                  <span className="ml-2 text-xs bg-green-400 text-green-900 px-2 py-1 rounded-full">
                    Current
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* My Courses - Simple Tiles */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {currentSemesterData?.isCurrent ? 'My Courses' : `Courses from ${currentSemesterData?.name}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
            <div 
              key={course.id}
              onClick={() => openCourse(course)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-500 overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${getColorClasses(course.color)} p-6 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-white text-gray-800 px-3 py-1 rounded-lg font-bold text-sm">
                    {course.code}
                  </span>
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                <p className="text-sm opacity-90">{course.professor}</p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-blue-600">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${getColorClasses(course.color)} h-2 rounded-full transition-all`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
  };

  // My Courses Page (Detailed View)
  const MyCoursesPage = () => {
    const filteredCourses = STUDENT_DATA.courses.filter(course => course.semester === selectedSemester);

    return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
      <p className="text-gray-600">{filteredCourses.length} Courses</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map(course => (
          <div 
            key={course.id}
            onClick={() => openCourse(course)}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-500 overflow-hidden"
          >
            <div className={`bg-gradient-to-br ${getColorClasses(course.color)} p-6 text-white`}>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-white text-gray-800 px-4 py-2 rounded-lg font-bold">
                  {course.code}
                </span>
                <div className="text-right">
                  <div className="text-2xl font-bold">{course.progress}%</div>
                  <div className="text-xs opacity-90">Complete</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
              <p className="text-lg opacity-90 flex items-center"><UserCircle className="h-5 w-5 mr-2 inline-block" /> {course.professor}</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{course.credits}</div>
                  <div className="text-xs text-gray-600">Credits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{courseMaterials[course.id]?.length || 0}</div>
                  <div className="text-xs text-gray-600">Materials</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {course.progress}%
                  </div>
                  <div className="text-xs text-gray-600">Progress</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`bg-gradient-to-r ${getColorClasses(course.color)} h-3 rounded-full transition-all`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>Click to view syllabus</span>
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  // Course Page (With Tabs)
  const CoursePage = () => {
    if (!selectedCourse) return null;

    const tabs = [
      { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
      { id: 'announcements', label: 'Announcements', icon: <Bell className="h-5 w-5" /> },
      { id: 'assignments', label: 'Assignments', icon: <FileText className="h-5 w-5" /> },
      { id: 'grades', label: 'Grades', icon: <Trophy className="h-5 w-5" /> },
      { id: 'attendance', label: 'Attendance', icon: <Calendar className="h-5 w-5" /> }
    ];

    return (
      <div className="space-y-6">
        <button
          onClick={() => setCurrentPage('my-courses')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          ← Back to My Courses
        </button>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className={`bg-gradient-to-r ${getColorClasses(selectedCourse.color)} p-8 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="bg-white text-gray-800 px-4 py-2 rounded-lg font-bold">{selectedCourse.code}</span>
                </div>
                <h1 className="text-4xl font-bold mb-2">{selectedCourse.title}</h1>
                <p className="text-lg opacity-90 flex items-center"><UserCircle className="h-5 w-5 mr-2" /> {selectedCourse.professor} • {selectedCourse.credits} Credits</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold mb-2">{selectedCourse.progress || 0}%</div>
                <div className="text-sm opacity-90">Course Progress</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCourseTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                    activeCourseTab === tab.id
                      ? 'border-b-4 border-blue-600 text-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Home Tab */}
            {activeCourseTab === 'home' && (
              <div>
                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold">Overall Progress</span>
                    <span className="text-blue-600 font-bold">{selectedCourse.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`bg-gradient-to-r ${getColorClasses(selectedCourse.color)} h-4 rounded-full transition-all`}
                      style={{ width: `${selectedCourse.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Week-by-Week Modules */}
                {selectedCourse?.modules && selectedCourse.modules.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">Weekly Modules</h2>
                    <div className="space-y-4">
                      {selectedCourse.modules.map((module: any) => {
                        const isCompleted = module.status === 'completed';
                        const isInProgress = module.status === 'in-progress';
                        const isAvailable = module.status === 'available';
                        const isLocked = module.status === 'locked';

                        return (
                          <div
                            key={module.id}
                            className={`border-2 rounded-lg overflow-hidden transition-shadow ${
                              isCompleted ? 'bg-green-50 border-green-300' :
                              isInProgress ? 'bg-blue-50 border-blue-300' :
                              isAvailable ? 'bg-yellow-50 border-yellow-300' :
                              'bg-gray-50 border-gray-300 opacity-60'
                            }`}
                          >
                            <div
                              className={`p-4 border-b cursor-pointer ${
                                isCompleted ? 'bg-green-100' :
                                isInProgress ? 'bg-blue-100' :
                                isAvailable ? 'bg-yellow-100' :
                                'bg-gray-100 cursor-not-allowed'
                              }`}
                              onClick={() => !isLocked && openModule(module)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 flex-1">
                                  {isCompleted && <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />}
                                  {isInProgress && <Play className="h-6 w-6 text-blue-600 flex-shrink-0" />}
                                  {isAvailable && <div className="w-6 h-6 rounded-full border-2 border-yellow-600 flex-shrink-0" />}
                                  {isLocked && <Lock className="h-6 w-6 text-gray-400 flex-shrink-0" />}

                                  <div className="flex-1">
                                    <h3 className="font-bold text-lg">Week {module.week}: {module.title}</h3>
                                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                                      {!isLocked && (
                                        <div className="flex items-center gap-2">
                                          <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div
                                              className={`h-2 rounded-full ${
                                                isCompleted ? 'bg-green-600' :
                                                isInProgress ? 'bg-blue-600' :
                                                'bg-yellow-600'
                                              }`}
                                              style={{ width: `${module.completion}%` }}
                                            />
                                          </div>
                                          <span className={`text-sm font-semibold ${
                                            isCompleted ? 'text-green-700' :
                                            isInProgress ? 'text-blue-700' :
                                            'text-yellow-700'
                                          }`}>
                                            {module.completion}%
                                          </span>
                                        </div>
                                      )}
                                      <span className="text-sm text-gray-600">
                                        {module.materials?.length || 0} materials
                                      </span>
                                      {module.xp && (
                                        <span className="text-sm text-gray-600">
                                          +{module.xp} XP
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  {isInProgress && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openModule(module);
                                      }}
                                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                                    >
                                      Continue
                                    </button>
                                  )}
                                  {isAvailable && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openModule(module);
                                      }}
                                      className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 font-semibold"
                                    >
                                      Start
                                    </button>
                                  )}
                                  {isCompleted && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openModule(module);
                                      }}
                                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
                                    >
                                      Review
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Materials preview - only show for non-locked modules */}
                            {!isLocked && (
                              <div className="p-4 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  {module.materials.slice(0, 3).map((material: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                      {material.type === 'video' && <Play className="h-4 w-4 text-blue-600 flex-shrink-0" />}
                                      {material.type === 'slides' && <FileText className="h-4 w-4 text-green-600 flex-shrink-0" />}
                                      {material.type === 'pdf' && <FileText className="h-4 w-4 text-red-600 flex-shrink-0" />}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{material.title}</p>
                                        {material.duration && (
                                          <p className="text-xs text-gray-500">{material.duration}</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {module.materials.length > 3 && (
                                  <p className="text-xs text-gray-500 mt-2 text-center">
                                    +{module.materials.length - 3} more materials
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <h2 className="text-2xl font-bold mb-6">Course Materials</h2>

                {/* Firebase Materials List */}
                {courseMaterials[selectedCourse?.id]?.length > 0 ? (
                  <div className="space-y-4">
                    {courseMaterials[selectedCourse?.id].map((material: any) => (
                      <div key={material.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-4 bg-gray-50 border-b">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-6 w-6 text-blue-600" />
                                <div>
                                  <h3 className="font-bold text-lg">{material.name}</h3>
                                  <p className="text-sm text-gray-600">
                                    Uploaded by {material.uploadedBy} on {material.uploadedAt?.toDate ? material.uploadedAt.toDate().toLocaleDateString() : new Date(material.uploadedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* Listen Button - Show if audio narration is available */}
                              {material.aiContent?.audioUrl && (
                                <button
                                  onClick={() => handlePlayAudio(material.id, material.aiContent.audioUrl)}
                                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                    playingAudio === material.id
                                      ? 'bg-green-500 text-white hover:bg-green-600'
                                      : 'text-green-600 bg-green-50 hover:bg-green-100'
                                  }`}
                                  title="Listen to AI narration"
                                >
                                  {playingAudio === material.id ? (
                                    <>
                                      <Pause className="h-4 w-4" />
                                      Pause
                                    </>
                                  ) : (
                                    <>
                                      <Volume2 className="h-4 w-4" />
                                      Listen
                                    </>
                                  )}
                                </button>
                              )}
                              <a
                                href={material.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2"
                              >
                                <Download className="h-4 w-4" />
                                Download
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* AI Study Tools Grid */}
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
                          <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-6 text-xl">
                            <Brain className="h-6 w-6 text-purple-600" />
                            Study Tools
                          </h4>

                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {/* Audio Narration Card - Show if available */}
                            {material.aiContent?.audioUrl && (
                              <button
                                onClick={() => handlePlayAudio(material.id, material.aiContent.audioUrl)}
                                className={`group rounded-2xl p-6 hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 text-left relative overflow-hidden ${
                                  playingAudio === material.id
                                    ? 'bg-gradient-to-br from-green-600 to-emerald-700 text-white'
                                    : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                                }`}
                              >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
                                {playingAudio === material.id ? (
                                  <Pause className="h-10 w-10 mb-4 relative z-10 animate-pulse" />
                                ) : (
                                  <Volume2 className="h-10 w-10 mb-4 relative z-10" />
                                )}
                                <h5 className="font-bold text-xl mb-2 relative z-10">
                                  {playingAudio === material.id ? 'Playing...' : 'Audio'}
                                </h5>
                                <div className="mt-2 text-xs opacity-75 relative z-10">
                                  {playingAudio === material.id ? 'Click to pause' : 'Listen to narration →'}
                                </div>
                              </button>
                            )}

                            {/* Flashcards Card - Always show */}
                            <button
                              onClick={() => setSelectedAITool({ materialId: material.id, toolType: 'flashcards' })}
                              className="group bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 text-left relative overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
                              <BookOpen className="h-10 w-10 mb-4 relative z-10" />
                              <h5 className="font-bold text-xl mb-2 relative z-10">Flashcards</h5>
                              <div className="mt-2 text-xs opacity-75 relative z-10">
                                {material.aiContent?.flashcards ? 'Click to study →' : 'Click to generate →'}
                              </div>
                            </button>

                            {/* Quiz Card - Always show */}
                            <button
                              onClick={() => setSelectedAITool({ materialId: material.id, toolType: 'quiz' })}
                              className="group bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl p-6 hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 text-left relative overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
                              <Target className="h-10 w-10 mb-4 relative z-10" />
                              <h5 className="font-bold text-xl mb-2 relative z-10">Practice Quiz</h5>
                              <div className="mt-2 text-xs opacity-75 relative z-10">
                                {material.aiContent?.quiz ? 'Click to practice →' : 'Click to generate →'}
                              </div>
                            </button>


                            {/* Mind Map Card - Always show */}
                            <button
                              onClick={() => setSelectedAITool({ materialId: material.id, toolType: 'mindmap' })}
                              className="group bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-2xl p-6 hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 text-left relative overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
                              <Map className="h-10 w-10 mb-4 relative z-10" />
                              <h5 className="font-bold text-xl mb-2 relative z-10">Mind Map</h5>
                              <div className="mt-2 text-xs opacity-75 relative z-10">
                                {material.aiContent?.mindMap ? 'Click to explore →' : 'Click to generate →'}
                              </div>
                            </button>

                            {/* Study Guide Card - Always show */}
                            <button
                              onClick={() => setSelectedAITool({ materialId: material.id, toolType: 'summary' })}
                              className="group bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl p-6 hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 text-left relative overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
                              <FileText className="h-10 w-10 mb-4 relative z-10" />
                              <h5 className="font-bold text-xl mb-2 relative z-10">Study Guide</h5>
                              <div className="mt-2 text-xs opacity-75 relative z-10">
                                {material.aiContent?.summary ? 'Click to read →' : 'Click to generate →'}
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p className="font-semibold text-lg">No materials uploaded yet</p>
                    <p className="text-sm">Your professor will upload course materials here</p>
                  </div>
                )}
              </div>
            )}

            {/* Announcements Tab */}
            {activeCourseTab === 'announcements' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Course Announcements</h2>
                {selectedCourse.announcements?.map((announcement) => (
                  <div key={announcement.id} className={`p-6 rounded-lg border-l-4 ${
                    announcement.priority === 'high' ? 'bg-red-50 border-red-500' :
                    announcement.priority === 'normal' ? 'bg-blue-50 border-blue-500' :
                    'bg-gray-50 border-gray-500'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold">{announcement.title}</h3>
                      <span className="text-sm text-gray-600">{announcement.date}</span>
                    </div>
                    <p className="text-gray-700">{announcement.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Assignments Tab */}
            {activeCourseTab === 'assignments' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Course Assignments</h2>
                {selectedCourse.assignments?.map((assignment) => (
                  <div key={assignment.id} className={`p-6 rounded-lg border-2 ${
                    assignment.status === 'graded' ? 'bg-green-50 border-green-300' :
                    assignment.status === 'submitted' ? 'bg-blue-50 border-blue-300' :
                    assignment.status === 'pending' ? 'bg-yellow-50 border-yellow-300' :
                    'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold">{assignment.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        assignment.status === 'graded' ? 'bg-green-500 text-white' :
                        assignment.status === 'submitted' ? 'bg-blue-500 text-white' :
                        assignment.status === 'pending' ? 'bg-yellow-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {assignment.status === 'graded' ? 'Graded' :
                         assignment.status === 'submitted' ? 'Submitted' :
                         assignment.status === 'pending' ? 'Pending' : 'Not Started'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Due Date:</span>
                        <span className="ml-2 font-semibold">{assignment.dueDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Points:</span>
                        <span className="ml-2 font-semibold">{assignment.points}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Grade:</span>
                        <span className="ml-2 font-semibold">{assignment.grade || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grades Tab */}
            {activeCourseTab === 'grades' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg border-2 border-blue-200">
                  <h2 className="text-3xl font-bold mb-2">Overall Grade</h2>
                  <div className="text-6xl font-bold text-blue-600">{selectedCourse.grades?.overall || 'N/A'}%</div>
                </div>

                <h3 className="text-2xl font-bold">Grade Breakdown</h3>
                <div className="space-y-3">
                  {selectedCourse.grades?.breakdown?.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-lg border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-lg">{item.category}</span>
                        <span className="text-xl font-bold text-blue-600">{item.score || 'N/A'}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-600 h-3 rounded-full"
                            style={{ width: `${item.score || 0}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">Weight: {item.weight}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attendance Tab */}
            {activeCourseTab === 'attendance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
                    <div className="text-3xl font-bold text-green-600">
                      {selectedCourse.attendance?.filter(a => a.status === 'present').length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Present</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-300">
                    <div className="text-3xl font-bold text-red-600">
                      {selectedCourse.attendance?.filter(a => a.status === 'absent').length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Absent</div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
                    <div className="text-3xl font-bold text-yellow-600">
                      {selectedCourse.attendance?.filter(a => a.status === 'late').length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Late</div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold">Attendance Record</h3>
                <div className="grid grid-cols-7 gap-2">
                  {selectedCourse.attendance?.map((record, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg text-center text-sm ${
                        record.status === 'present' ? 'bg-green-100 border-2 border-green-400' :
                        record.status === 'absent' ? 'bg-red-100 border-2 border-red-400' :
                        'bg-yellow-100 border-2 border-yellow-400'
                      }`}
                    >
                      <div className="font-bold">{record.date}</div>
                      <div className="text-xs capitalize">{record.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Module Detail Page
  const ModulePage = () => {
    if (!selectedModule || !selectedCourse) return null;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setCurrentPage('course')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          ← Back to {selectedCourse.code}
        </button>

        {/* Module Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className={`bg-gradient-to-r ${getColorClasses(selectedCourse.color)} p-8 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="bg-white text-gray-800 px-3 py-1 rounded-lg font-bold text-sm">
                    Week {selectedModule.week}
                  </span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-lg text-sm">
                    {selectedCourse.code}
                  </span>
                </div>
                <h1 className="text-4xl font-bold mb-2">{selectedModule.title}</h1>
                <p className="text-lg opacity-90">{selectedCourse.title}</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold mb-2">{selectedModule.completion}%</div>
                <div className="text-sm opacity-90">Module Complete</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">Module Progress</span>
                <span className="text-blue-600 font-bold">{selectedModule.completion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`bg-gradient-to-r ${getColorClasses(selectedCourse.color)} h-4 rounded-full transition-all`}
                  style={{ width: `${selectedModule.completion}%` }}
                />
              </div>
            </div>

            {/* Main Content Materials */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Module Materials</h2>
              <div className="grid gap-3">
                {selectedModule.materials?.map((material, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => (material.type === 'pdf' || material.type === 'slides') && openMaterial(material)}
                    className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition ${
                      (material.type === 'pdf' || material.type === 'slides') ? 'cursor-pointer' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {material.type === 'pdf' && <FileText className="h-6 w-6 text-red-500" />}
                      {material.type === 'slides' && <FileText className="h-6 w-6 text-orange-500" />}
                      {material.type === 'video-ai' && <Video className="h-6 w-6 text-purple-500" />}
                      <div>
                        <div className="font-semibold text-gray-900">{material.name}</div>
                        <div className="text-sm text-gray-600">
                          {material.size || material.duration}
                          {material.type === 'video-ai' && (
                            <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                              AI Generated
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(material.type === 'pdf' || material.type === 'slides') && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            showNotification('Read Aloud activated');
                          }}
                          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 text-sm"
                        >
                          <Volume2 className="h-4 w-4" />
                          Read Aloud
                        </button>
                      )}
                      {material.type === 'video-ai' && (
                        <button className="flex items-center gap-2 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 text-sm">
                          <Play className="h-4 w-4" />
                          Watch
                        </button>
                      )}
                      <Download className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Study Tools */}
            <div className="border-t-2 pt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">AI Study Tools</h2>
                  <p className="text-gray-600 text-sm">Generated from module materials above</p>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-900">AI-Powered</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* AI Explainer Video - First if available */}
                {selectedModule.hasAIVideo && selectedModule.aiVideoData && (
                  <div
                    className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl text-white cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <Video className="h-10 w-10 mb-3" />
                    <h3 className="text-xl font-bold mb-2">AI Explainer Video</h3>
                    <p className="text-sm opacity-90">Watch AI-generated video explanation</p>
                    <div className="mt-3 text-xs opacity-80">{selectedModule.aiVideoData.duration}</div>
                  </div>
                )}

                {/* Other AI Tools */}
                {AI_TOOLS.map(tool => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => openTool(tool)}
                      className={`bg-gradient-to-br ${getColorClasses(tool.color)} p-6 rounded-xl text-white cursor-pointer hover:shadow-xl transition-all transform hover:scale-105`}
                    >
                      <Icon className="h-10 w-10 mb-3" />
                      <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                      <p className="text-sm opacity-90">{tool.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Material Viewer Page (PDF/Slides with Read Aloud)
  const MaterialPage = () => {
    if (!selectedMaterial || !selectedModule) return null;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isReading, setIsReading] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [pageNum, setPageNum] = useState(1);
    const totalPages = 15; // Mock

    return (
      <div className="space-y-6">
        <button
          onClick={() => setCurrentPage('module')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
          aria-label="Back to Module"
        >
          ← Back to Module
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">{selectedMaterial.name}</h1>
                <p className="text-gray-300">Week {selectedModule.week}: {selectedModule.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setIsReading(!isReading);
                    showNotification(isReading ? 'Read Aloud paused' : 'Read Aloud started');
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                    isReading ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isReading ? <Pause className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  {isReading ? 'Stop Reading' : 'Read Aloud'}
                </button>
                <button className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600">
                  <Download className="h-5 w-5" />
                </button>
                <button className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600">
                  <Maximize2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Document Viewer */}
            <div className="bg-gray-100 rounded-lg p-12 mb-6 min-h-96 flex items-center justify-center border-4 border-gray-300">
              <div className="text-center">
                <FileText className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-bold text-gray-700 mb-2">
                  Page {pageNum} of {totalPages}
                </p>
                <p className="text-gray-600">
                  {isReading && (
                    <span className="flex items-center justify-center gap-2 text-blue-600 font-semibold">
                      <Volume2 className="h-5 w-5 animate-pulse" />
                      Reading aloud...
                    </span>
                  )}
                </p>
                <div className="mt-8 text-left max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
                  <h3 className="font-bold text-lg mb-3">Stacks and Queues</h3>
                  <p className="text-gray-700 mb-3">
                    A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. 
                    This means that the last element added to the stack will be the first one to be removed.
                  </p>
                  <p className="text-gray-700">
                    Common operations include push (add to top), pop (remove from top), and peek (view top element).
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setPageNum(Math.max(1, pageNum - 1))}
                disabled={pageNum === 1}
                className="px-6 py-3 bg-gray-200 rounded-lg font-semibold disabled:opacity-50 hover:bg-gray-300"
                aria-label="Previous Page"
              >
                ← Previous Page
              </button>
              <div className="text-gray-600 font-semibold">
                Page {pageNum} of {totalPages}
              </div>
              <button
                onClick={() => setPageNum(Math.min(totalPages, pageNum + 1))}
                disabled={pageNum === totalPages}
                className="px-6 py-3 bg-gray-200 rounded-lg font-semibold disabled:opacity-50 hover:bg-gray-300"
                aria-label="Next Page"
              >
                Next Page →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tool Page (Individual AI Tool Interface)
  const ToolPage = () => {
    if (!selectedTool || !selectedModule) return null;

    const renderToolContent = () => {
      switch(selectedTool.id) {
        case 'mindmap':
          return <MindMapTool />;
        case 'flashcards':
          return <FlashcardsTool />;
        case 'quiz':
          return <QuizTool />;
        case 'chat':
          return <ChatTool />;
        default:
          return <div>Tool content</div>;
      }
    };

    return (
      <div className="space-y-6">
        <button
          onClick={() => setCurrentPage('module')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          ← Back to Module
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className={`bg-gradient-to-r ${getColorClasses(selectedTool.color)} p-8 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {React.createElement(selectedTool.icon, { className: "h-8 w-8" })}
                  <h1 className="text-4xl font-bold">{selectedTool.title}</h1>
                </div>
                <p className="text-lg opacity-90">Week {selectedModule.week}: {selectedModule.title}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {renderToolContent()}
          </div>
        </div>
      </div>
    );
  };

  // Tool Components
  const MindMapTool = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
        <p className="text-sm text-purple-900">
          <strong>AI-Generated:</strong> Interactive concept map showing relationships between key topics in this module.
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200 min-h-96">
        <div className="text-center text-gray-500">
          <Brain className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="mb-2 font-bold text-lg">Mind Map: Stacks & Queues</p>
          <p className="text-sm mb-8">Interactive graph visualization would render here</p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <div className="bg-white px-4 py-2 rounded-lg shadow text-sm">Zoom In/Out</div>
            <div className="bg-white px-4 py-2 rounded-lg shadow text-sm">Pan Around</div>
            <div className="bg-white px-4 py-2 rounded-lg shadow text-sm">Click Nodes for Details</div>
            <div className="bg-white px-4 py-2 rounded-lg shadow text-sm">Export as Image</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <h3 className="font-bold text-lg mb-3">Key Concepts in this Module:</h3>
        <div className="flex flex-wrap gap-2">
          {['LIFO', 'FIFO', 'Push', 'Pop', 'Enqueue', 'Dequeue', 'Peek', 'isEmpty', 'Time Complexity'].map(concept => (
            <span key={concept} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
              {concept}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const FlashcardsTool = () => {
    const [currentCard, setCurrentCard] = useState(0);
    const [flipped, setFlipped] = useState(false);
    
    const cards = [
      { q: "What is a Stack?", a: "A Last-In-First-Out (LIFO) data structure where elements are added and removed from the same end." },
      { q: "What is a Queue?", a: "A First-In-First-Out (FIFO) data structure where elements are added at the rear and removed from the front." },
      { q: "What is the time complexity of push operation in a stack?", a: "O(1) - Constant time" },
      { q: "What does 'peek' do in a stack?", a: "Returns the top element without removing it from the stack." }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-sm text-green-900">
            <strong>AI-Generated:</strong> {cards.length} flashcards created from module content. Click to flip!
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button 
            onClick={() => {
              setCurrentCard(Math.max(0, currentCard - 1));
              setFlipped(false);
            }}
            disabled={currentCard === 0}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-600 font-semibold">Card {currentCard + 1} of {cards.length}</span>
          <button 
            onClick={() => {
              setCurrentCard(Math.min(cards.length - 1, currentCard + 1));
              setFlipped(false);
            }}
            disabled={currentCard === cards.length - 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
          >
            Next →
          </button>
        </div>

        <div 
          onClick={() => setFlipped(!flipped)}
          className="bg-white rounded-xl shadow-lg p-12 min-h-80 flex items-center justify-center cursor-pointer hover:shadow-xl transition-all border-4 border-green-500"
        >
          <div className="text-center max-w-2xl">
            <div className="text-2xl font-bold text-gray-900 mb-4">
              {flipped ? cards[currentCard].a : cards[currentCard].q}
            </div>
            <p className="text-sm text-gray-500">
              {flipped ? 'Click to see question' : 'Click to reveal answer'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-semibold flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />
            Export as CSV
          </button>
          <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />
            Export to Anki
          </button>
        </div>
      </div>
    );
  };

  const QuizTool = () => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const questions = [
      {
        id: 1,
        q: "Which operation adds an element to a stack?",
        options: ["Push", "Pop", "Enqueue", "Dequeue"],
        correct: 0
      },
      {
        id: 2,
        q: "What does FIFO stand for?",
        options: ["Fast In Fast Out", "First In First Out", "Forward In Forward Out", "Fixed Input Fixed Output"],
        correct: 1
      },
      {
        id: 3,
        q: "What is the time complexity of dequeue operation?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correct: 2
      }
    ];

    const handleSubmit = () => {
      setSubmitted(true);
      const correct = questions.filter((q) => answers[q.id] === q.correct).length;
      showNotification(`Quiz submitted! Score: ${correct}/${questions.length}`);
    };

    return (
      <div className="space-y-6">
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <p className="text-sm text-orange-900">
            <strong>AI-Generated:</strong> Test your knowledge with {questions.length} questions based on this module's content.
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((question, idx) => (
            <div key={question.id} className="bg-white rounded-lg p-6 border-2 border-gray-200">
              <h3 className="font-bold text-lg mb-4">
                {idx + 1}. {question.q}
              </h3>
              <div className="space-y-2">
                {question.options.map((option, optIdx) => (
                  <label 
                    key={optIdx}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                      answers[question.id] === optIdx ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                    } ${submitted && optIdx === question.correct ? 'border-green-500 bg-green-50' : ''}
                    ${submitted && answers[question.id] === optIdx && optIdx !== question.correct ? 'border-red-500 bg-red-50' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name={`q${question.id}`}
                      disabled={submitted}
                      checked={answers[question.id] === optIdx}
                      onChange={() => setAnswers({...answers, [question.id]: optIdx})}
                      className="w-4 h-4"
                    />
                    <span className="flex-1">{option}</span>
                    {submitted && optIdx === question.correct && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {submitted && answers[question.id] === optIdx && optIdx !== question.correct && <X className="h-5 w-5 text-red-500" />}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!submitted && (
          <button 
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
            className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Quiz
          </button>
        )}

        {submitted && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-green-900 mb-2">Quiz Completed!</h3>
            <p className="text-green-800">
              You scored {questions.filter((q) => answers[q.id] === q.correct).length} out of {questions.length}
            </p>
            <button 
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
              className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 font-semibold"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    );
  };

  const ChatTool = () => {
    const [messages, setMessages] = useState([
      { role: 'assistant', text: "Hi! I'm your AI study assistant for Week 3: Stacks & Queues. Ask me anything about this module!" }
    ]);
    const [input, setInput] = useState('');

    const sendMessage = () => {
      if (!input.trim()) return;

      const userMsg = input;
      setMessages([...messages,
        { role: 'user', text: userMsg },
        { role: 'assistant', text: `Great question about "${userMsg}"! Based on your module materials: A stack follows the LIFO principle, meaning the last element added is the first one removed. This is like a stack of plates - you add to the top and remove from the top. [Source: Lecture Notes.pdf, Page 3]` }
      ]);
      setInput('');
    };

    return (
      <div className="space-y-6">
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
          <p className="text-sm text-indigo-900">
            <strong>AI-Powered Chat:</strong> Ask questions about this module's content. Answers are grounded in your materials with citations.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl border-2 border-gray-200 h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md px-4 py-3 rounded-lg ${
                msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-white border-2 border-gray-200 text-gray-900'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask a question about this module..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    );
  };

  // Achievements Page
  const AchievementsPage = () => {
    const unlockedAchievements = ACHIEVEMENTS.filter(a => a.unlocked);
    const lockedAchievements = ACHIEVEMENTS.filter(a => !a.unlocked);
    const totalXpEarned = unlockedAchievements.reduce((sum, a) => sum + a.xpReward, 0);

    const categories = [...new Set(ACHIEVEMENTS.map(a => a.category))];

    const getColorClasses = (color: string) => {
      const colorMap: Record<string, string> = {
        yellow: 'from-yellow-400 to-yellow-600',
        purple: 'from-purple-500 to-purple-700',
        red: 'from-red-500 to-red-700',
        orange: 'from-orange-500 to-orange-700',
        blue: 'from-blue-500 to-blue-700',
        green: 'from-green-500 to-green-700',
        gold: 'from-yellow-500 to-amber-600',
        indigo: 'from-indigo-500 to-indigo-700',
        teal: 'from-teal-500 to-teal-700'
      };
      return colorMap[color] || 'from-gray-500 to-gray-700';
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Achievements</h1>
          <p className="text-purple-100 mb-6">Track your learning milestones and earn rewards</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <Trophy className="h-8 w-8 mb-2" />
              <div className="text-3xl font-bold">{unlockedAchievements.length}</div>
              <div className="text-sm opacity-90">Unlocked</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <Lock className="h-8 w-8 mb-2" />
              <div className="text-3xl font-bold">{lockedAchievements.length}</div>
              <div className="text-sm opacity-90">Locked</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <Zap className="h-8 w-8 mb-2" />
              <div className="text-3xl font-bold">{totalXpEarned}</div>
              <div className="text-sm opacity-90">Total XP Earned</div>
            </div>
          </div>
        </div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Unlocked Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedAchievements.map(achievement => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-green-300 overflow-hidden"
                  >
                    <div className={`bg-gradient-to-br ${getColorClasses(achievement.color)} p-6 text-white relative`}>
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-6 w-6 text-green-300" />
                      </div>
                      <Icon className="h-12 w-12 mb-3 opacity-90" />
                      <h3 className="text-xl font-bold mb-1">{achievement.title}</h3>
                      <p className="text-sm opacity-90">{achievement.description}</p>
                    </div>
                    <div className="p-4 bg-green-50">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Unlocked: {new Date(achievement.unlockedDate || '').toLocaleDateString()}
                        </span>
                        <span className="font-bold text-green-600">+{achievement.xpReward} XP</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* In Progress / Locked Achievements by Category */}
        {categories.map(category => {
          const categoryAchievements = lockedAchievements.filter(a => a.category === category);
          if (categoryAchievements.length === 0) return null;

          return (
            <div key={category}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryAchievements.map(achievement => {
                  const Icon = achievement.icon;
                  const progressPercent = (achievement.progress / achievement.maxProgress) * 100;

                  return (
                    <div
                      key={achievement.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-gray-200 overflow-hidden"
                    >
                      <div className={`bg-gradient-to-br ${getColorClasses(achievement.color)} p-6 text-white relative opacity-60`}>
                        <div className="absolute top-2 right-2">
                          <Lock className="h-6 w-6 text-gray-300" />
                        </div>
                        <Icon className="h-12 w-12 mb-3" />
                        <h3 className="text-xl font-bold mb-1">{achievement.title}</h3>
                        <p className="text-sm opacity-90">{achievement.description}</p>
                      </div>
                      <div className="p-4">
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-bold text-gray-900">
                              {achievement.progress} / {achievement.maxProgress}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`bg-gradient-to-r ${getColorClasses(achievement.color)} h-3 rounded-full transition-all`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm pt-2 border-t">
                          <span className="text-gray-600">Reward</span>
                          <span className="font-bold text-purple-600">+{achievement.xpReward} XP</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Calendar Page - Monthly calendar view with assignments
  const CalendarPage = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time every minute to keep "today" accurate
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000); // Update every minute
      return () => clearInterval(timer);
    }, []);

    // Get user's locale and timezone
    const userLocale = navigator.language || 'en-US';
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Get all enrolled courses (current semester)
    const enrolledCourses = STUDENT_DATA.courses.filter(course => course.semester === 'fall-2024');

    // Aggregate all due dates
    const allDueDates = enrolledCourses.flatMap(course => {
      if (!course.assignments) return [];
      return course.assignments.map(assignment => ({
        date: assignment.dueDate,
        title: assignment.title,
        courseCode: course.code,
        courseTitle: course.title,
        courseColor: course.color,
        status: assignment.status,
        points: assignment.points,
        submitted: assignment.submitted,
        grade: assignment.grade
      }));
    });

    // Get calendar data - using user's current date/time
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Use currentTime for accurate "today" detection in user's timezone
    const today = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
    const todayStr = today.toISOString().split('T')[0];

    // Create calendar grid
    const calendarDays = [];
    const totalSlots = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;

    for (let i = 0; i < totalSlots; i++) {
      const dayNumber = i - startingDayOfWeek + 1;
      if (dayNumber > 0 && dayNumber <= daysInMonth) {
        const date = new Date(year, month, dayNumber);
        const dateStr = date.toISOString().split('T')[0];
        const dayAssignments = allDueDates.filter(a => a.date === dateStr);

        calendarDays.push({
          date,
          dateStr,
          dayNumber,
          isCurrentMonth: true,
          isToday: dateStr === todayStr,
          assignments: dayAssignments
        });
      } else {
        calendarDays.push({
          date: null,
          dateStr: '',
          dayNumber: null,
          isCurrentMonth: false,
          isToday: false,
          assignments: []
        });
      }
    }

    // Get localized month and day names based on user's region
    const monthNames = Array.from({ length: 12 }, (_, i) =>
      new Date(2024, i, 1).toLocaleDateString(userLocale, { month: 'long' })
    );

    const dayNames = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(2024, 0, i); // Start from a Sunday
      return date.toLocaleDateString(userLocale, { weekday: 'short' });
    });

    const goToPreviousMonth = () => {
      setCurrentMonth(new Date(year, month - 1, 1));
      setSelectedDate(null);
    };

    const goToNextMonth = () => {
      setCurrentMonth(new Date(year, month + 1, 1));
      setSelectedDate(null);
    };

    const goToToday = () => {
      setCurrentMonth(new Date());
      setSelectedDate(null);
    };

    // Format date using user's locale and timezone
    const formatDateLocalized = (date: Date) => {
      return date.toLocaleDateString(userLocale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: userTimezone
      });
    };

    const selectedDateAssignments = selectedDate
      ? allDueDates.filter(a => a.date === selectedDate.toISOString().split('T')[0])
      : [];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600 mt-1">
              View all your assignments and due dates
              <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">
                {userTimezone}
              </span>
            </p>
          </div>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Today
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Month Navigation */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
              >
                <ChevronRight className="h-6 w-6 transform rotate-180" />
              </button>
              <h2 className="text-2xl font-bold">
                {monthNames[month]} {year}
              </h2>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-gray-100 border-b-2 border-gray-300">
            {dayNames.map(day => (
              <div key={day} className="p-3 text-center font-bold text-gray-700 text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                onClick={() => day.isCurrentMonth && setSelectedDate(day.date)}
                className={`min-h-32 p-2 border border-gray-200 ${
                  !day.isCurrentMonth ? 'bg-gray-50' :
                  day.isToday ? 'bg-blue-50' :
                  'bg-white hover:bg-gray-50'
                } ${day.isCurrentMonth ? 'cursor-pointer' : ''} transition`}
              >
                {day.isCurrentMonth && (
                  <div>
                    <div className={`text-sm font-bold mb-1 ${
                      day.isToday ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center' :
                      'text-gray-700'
                    }`}>
                      {day.dayNumber}
                    </div>
                    <div className="space-y-1">
                      {day.assignments.slice(0, 3).map((assignment, aIdx) => (
                        <div
                          key={aIdx}
                          className={`text-xs p-1 rounded truncate ${
                            assignment.status === 'graded' ? 'bg-green-100 text-green-800' :
                            assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                            assignment.date < todayStr ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}
                          title={`${assignment.courseCode}: ${assignment.title}`}
                        >
                          <span className="font-semibold">{assignment.courseCode}</span>
                        </div>
                      ))}
                      {day.assignments.length > 3 && (
                        <div className="text-xs text-gray-600 font-semibold">
                          +{day.assignments.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {formatDateLocalized(selectedDate)}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {selectedDateAssignments.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No assignments due on this date</p>
            ) : (
              <div className="space-y-3">
                {selectedDateAssignments.map((assignment, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-l-4 ${
                      assignment.status === 'graded' ? 'bg-green-50 border-green-500' :
                      assignment.status === 'submitted' ? 'bg-blue-50 border-blue-500' :
                      assignment.date < todayStr ? 'bg-red-50 border-red-500' :
                      'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-lg font-bold text-xs text-white bg-gradient-to-r ${getColorClasses(assignment.courseColor)}`}>
                            {assignment.courseCode}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            assignment.status === 'graded' ? 'bg-green-500 text-white' :
                            assignment.status === 'submitted' ? 'bg-blue-500 text-white' :
                            assignment.status === 'pending' ? 'bg-yellow-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {assignment.status === 'graded' ? 'Graded' :
                             assignment.status === 'submitted' ? 'Submitted' :
                             assignment.status === 'pending' ? 'Pending' : 'Not Started'}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">{assignment.title}</h4>
                        <p className="text-sm text-gray-600">{assignment.courseTitle}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Points</div>
                        <div className="font-bold text-gray-900">{assignment.points}</div>
                        {assignment.grade && (
                          <>
                            <div className="text-sm text-gray-600 mt-2">Grade</div>
                            <div className="font-bold text-green-600">{assignment.grade}</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Layout
  const AppLayout = ({ children }) => (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all flex flex-col`}>
        <div className="p-6 border-b flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">ACLE</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle Sidebar">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem icon={<Home />} label="Dashboard" active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} collapsed={!sidebarOpen} />

          {userRole === 'student' && (
            <>
              <NavItem icon={<List />} label="My Courses" active={currentPage === 'my-courses'} onClick={() => setCurrentPage('my-courses')} collapsed={!sidebarOpen} />
              <NavItem icon={<Calendar />} label="Calendar" active={currentPage === 'calendar'} onClick={() => setCurrentPage('calendar')} collapsed={!sidebarOpen} />
              <NavItem icon={<Trophy />} label="Achievements" active={currentPage === 'achievements'} onClick={() => setCurrentPage('achievements')} collapsed={!sidebarOpen} />
            </>
          )}

          {userRole === 'professor' && (
            <>
              <NavItem icon={<BookOpen />} label="My Courses" active={currentPage === 'my-courses'} onClick={() => setCurrentPage('my-courses')} collapsed={!sidebarOpen} />
              <NavItem icon={<Users />} label="Students" active={currentPage === 'students'} onClick={() => showNotification('Student management coming soon')} collapsed={!sidebarOpen} />
              <NavItem icon={<Calendar />} label="Schedule" active={currentPage === 'schedule'} onClick={() => showNotification('Schedule view coming soon')} collapsed={!sidebarOpen} />
            </>
          )}
        </nav>

        <div className="p-4 border-t">
          <button className="w-full flex items-center space-x-3 text-gray-700 hover:bg-gray-100 p-3 rounded-lg">
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Role Switcher */}
            <button
              onClick={() => {
                setUserRole(userRole === 'student' ? 'professor' : 'student');
                setCurrentPage('dashboard');
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-shadow"
            >
              Switch to {userRole === 'student' ? 'Professor' : 'Student'} View
            </button>
            <span className="text-sm text-gray-600">
              Current: <span className="font-bold">{userRole === 'student' ? 'Student' : 'Professor'}</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {userRole === 'student' && (
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="font-bold">{STUDENT_DATA.xp} XP</span>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {userRole === 'student'
                  ? STUDENT_DATA.name.split(' ').map(n => n.charAt(0)).join('')
                  : PROFESSOR_DATA.name.split(' ').map(n => n.charAt(0)).join('')
                }
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      <AppLayout>
        {/* Professor Pages */}
        {userRole === 'professor' && currentPage === 'dashboard' && <ProfessorDashboard />}
        {userRole === 'professor' && currentPage === 'professor-course' && <ProfessorCoursePage />}

        {/* Student Pages */}
        {userRole === 'student' && currentPage === 'dashboard' && <DashboardPage />}
        {userRole === 'student' && currentPage === 'my-courses' && <MyCoursesPage />}
        {userRole === 'student' && currentPage === 'calendar' && <CalendarPage />}
        {userRole === 'student' && currentPage === 'achievements' && <AchievementsPage />}
        {userRole === 'student' && currentPage === 'course' && <CoursePage />}
        {userRole === 'student' && currentPage === 'module' && <ModulePage />}
        {userRole === 'student' && currentPage === 'material' && <MaterialPage />}
        {userRole === 'student' && currentPage === 'tool' && <ToolPage />}
      </AppLayout>

      {/* Notifications */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-semibold animate-slide-in">
            {notification}
          </div>
        </div>
      )}

      {/* AI Tool Modal */}
      {selectedAITool && (() => {
        const material = courseMaterials[selectedCourse?.id]?.find((m: any) => m.id === selectedAITool.materialId);
        if (!material) return null;

        // USING HARDCODED DATA STRUCTURES CONTENT - No AI generation needed

        const toggleCard = (idx: number) => {
          const newFlipped = new Set(flippedCards);
          if (newFlipped.has(idx)) {
            newFlipped.delete(idx);
          } else {
            newFlipped.add(idx);
          }
          setFlippedCards(newFlipped);
        };

        const selectQuizAnswer = (questionIdx: number, optionIdx: number) => {
          if (!quizSubmitted) {
            setQuizAnswers({...quizAnswers, [questionIdx]: optionIdx});
          }
        };

        const submitQuiz = () => {
          setQuizSubmitted(true);
        };

        const resetQuiz = () => {
          setQuizAnswers({});
          setQuizSubmitted(false);
        };

        const renderToolContent = () => {
          // RENDER HARDCODED DATA STRUCTURES CONTENT DIRECTLY
          switch(selectedAITool.toolType) {
            case 'flashcards':
              // USE HARDCODED DATA STRUCTURES FLASHCARDS
              const flashcardsData = HARDCODED_DSA_FLASHCARDS;
              const currentCard = flashcardsData[currentCardIndex];
              const isFlipped = flippedCards.has(currentCardIndex);

              return (
                <div className="space-y-6">
                  {/* Flashcard Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
                      disabled={currentCardIndex === 0}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      ← Previous
                    </button>
                    <span className="text-gray-600 font-medium">
                      Card {currentCardIndex + 1} of {flashcardsData.length}
                    </span>
                    <button
                      onClick={() => setCurrentCardIndex(Math.min(flashcardsData.length - 1, currentCardIndex + 1))}
                      disabled={currentCardIndex === flashcardsData.length - 1}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      Next →
                    </button>
                  </div>

                  {/* Flashcard */}
                  <div
                    onClick={() => toggleCard(currentCardIndex)}
                    className="relative h-80 cursor-pointer perspective-1000"
                  >
                    <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                      {/* Front */}
                      <div className="absolute w-full h-full backface-hidden">
                        <div className="h-full bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-8 flex flex-col items-center justify-center shadow-xl">
                          <div className="text-sm opacity-90 mb-4">QUESTION</div>
                          <p className="text-2xl font-bold text-center">{currentCard.question}</p>
                          <div className="mt-8 text-sm opacity-75">Click to reveal answer</div>
                        </div>
                      </div>
                      {/* Back */}
                      <div className="absolute w-full h-full backface-hidden rotate-y-180">
                        <div className="h-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-8 flex flex-col items-center justify-center shadow-xl">
                          <div className="text-sm opacity-90 mb-4">ANSWER</div>
                          <p className="text-xl text-center leading-relaxed">{currentCard.answer}</p>
                          <div className="mt-8 text-sm opacity-75">Click to see question</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{width: `${((currentCardIndex + 1) / flashcardsData.length) * 100}%`}}
                    ></div>
                  </div>
                </div>
              );

            case 'quiz':
              // USE HARDCODED DATA STRUCTURES QUIZ
              const quizData = HARDCODED_DSA_QUIZ;
              const score = quizSubmitted ? quizData.reduce((acc: number, q: any, idx: number) => {
                return acc + (quizAnswers[idx] === q.correctAnswer ? 1 : 0);
              }, 0) : 0;
              const totalQuestions = quizData.length;
              const percentage = quizSubmitted ? Math.round((score / totalQuestions) * 100) : 0;

              return (
                <div className="space-y-6">
                  {/* Quiz Header with Score */}
                  {quizSubmitted && (
                    <div className={`p-6 rounded-xl ${percentage >= 70 ? 'bg-green-100 border-2 border-green-500' : 'bg-orange-100 border-2 border-orange-500'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">Quiz Results</h3>
                          <p className="text-gray-700 mt-1">You scored {score} out of {totalQuestions} ({percentage}%)</p>
                        </div>
                        <button
                          onClick={resetQuiz}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                          Retake Quiz
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Questions */}
                  {quizData.map((question: any, idx: number) => {
                    const selectedAnswer = quizAnswers[idx];
                    const isCorrect = selectedAnswer === question.correctAnswer;

                    return (
                      <div key={idx} className="bg-white p-6 rounded-lg border-2 border-blue-300">
                        <div className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Question {idx + 1}
                          {quizSubmitted && (
                            <span className={`ml-auto px-3 py-1 rounded-full text-sm ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-lg text-gray-900 mb-4">{question.question}</p>
                        <div className="space-y-2">
                          {question.options.map((option: string, optIdx: number) => {
                            const isSelected = selectedAnswer === optIdx;
                            const isCorrectAnswer = optIdx === question.correctAnswer;
                            const showAsCorrect = quizSubmitted && isCorrectAnswer;
                            const showAsWrong = quizSubmitted && isSelected && !isCorrect;

                            return (
                              <button
                                key={optIdx}
                                onClick={() => selectQuizAnswer(idx, optIdx)}
                                disabled={quizSubmitted}
                                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                                  showAsCorrect
                                    ? 'bg-green-100 border-green-500'
                                    : showAsWrong
                                    ? 'bg-red-100 border-red-500'
                                    : isSelected
                                    ? 'bg-blue-100 border-blue-500'
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                } ${quizSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                                    showAsCorrect
                                      ? 'bg-green-500 text-white'
                                      : showAsWrong
                                      ? 'bg-red-500 text-white'
                                      : isSelected
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-gray-200 text-gray-700'
                                  }`}>
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="text-gray-900 flex-1">{option}</span>
                                  {showAsCorrect && (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  )}
                                  {showAsWrong && (
                                    <X className="h-5 w-5 text-red-600" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Submit Button */}
                  {!quizSubmitted && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={submitQuiz}
                        disabled={Object.keys(quizAnswers).length !== totalQuestions}
                        className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold text-lg shadow-lg"
                      >
                        Submit Quiz ({Object.keys(quizAnswers).length}/{totalQuestions} answered)
                      </button>
                    </div>
                  )}
                </div>
              );

            case 'mindmap':
              // USE HARDCODED DATA STRUCTURES MIND MAP
              const mindMapData = HARDCODED_DSA_MINDMAP;
              return (
                <div className="bg-white p-8 rounded-lg">
                  <div className="text-center mb-8">
                    <div className="inline-block bg-gradient-to-br from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl shadow-lg font-bold text-xl">
                      {mindMapData.central}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mindMapData.branches.map((branch: string, idx: number) => (
                      <div key={idx} className="relative">
                        <div className="bg-purple-100 border-2 border-purple-300 text-purple-900 px-4 py-3 rounded-lg text-center font-semibold hover:shadow-md transition-shadow">
                          {branch}
                        </div>
                        <div className="absolute top-1/2 -left-4 w-4 h-0.5 bg-purple-300 hidden md:block"></div>
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'summary':
              // USE HARDCODED DATA STRUCTURES SUMMARY
              const summaryText = HARDCODED_DSA_SUMMARY;
              const keyTopicsData = HARDCODED_DSA_KEY_TOPICS;
              return (
                <div className="bg-white p-6 rounded-lg">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 text-lg leading-relaxed mb-6 whitespace-pre-line">{summaryText}</p>
                    {keyTopicsData && keyTopicsData.length > 0 && (
                      <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                          <Star className="h-5 w-5" />
                          Key Topics
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {keyTopicsData.map((topic: string, idx: number) => (
                            <span key={idx} className="bg-white text-orange-900 px-4 py-2 rounded-lg border border-orange-300 font-medium">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );

            default:
              return null;
          }
        };

        const toolInfo = {
          flashcards: { title: 'Flashcards', icon: BookOpen, color: 'from-green-500 to-emerald-600' },
          quiz: { title: 'Practice Quiz', icon: Target, color: 'from-blue-500 to-indigo-600' },
          mindmap: { title: 'Mind Map', icon: Map, color: 'from-purple-500 to-pink-600' },
          summary: { title: 'Study Guide', icon: FileText, color: 'from-orange-500 to-amber-600' }
        }[selectedAITool.toolType];

        if (!toolInfo) return null;
        const ToolIcon = toolInfo.icon;

        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-50 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className={`bg-gradient-to-r ${toolInfo.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ToolIcon className="h-8 w-8" />
                    <div>
                      <h2 className="text-2xl font-bold">{toolInfo.title}</h2>
                      <p className="text-sm opacity-90">{material.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAITool(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {renderToolContent()}
              </div>

              {/* Footer */}
              <div className="border-t bg-white p-4 flex justify-end">
                <button
                  onClick={() => setSelectedAITool(null)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    {React.cloneElement(icon, { className: 'h-5 w-5' })}
    {!collapsed && <span className="font-medium">{label}</span>}
  </button>
);
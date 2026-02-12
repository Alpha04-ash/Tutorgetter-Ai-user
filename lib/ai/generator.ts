
// Dynamic AI Question Generator
// concept-based template engine to avoid repetition

interface ConceptBank {
    topics: string[];
    advanced_topics: string[];
    patterns: string[];
}

const CONCEPTS: Record<string, ConceptBank> = {
    python: {
        topics: [
            "Lists", "Tuples", "Dictionaries", "Sets", "Strings", "Integers", "Floats",
            "Functions", "Lambdas", "Decorators", "Generators", "Iterators", "Modules",
            "Packages", "Virtual Environments", "PIP", "Type Hinting", "Exceptions"
        ],
        advanced_topics: [
            "Global Interpreter Lock (GIL)", "Memory Management", "Garbage Collection",
            "Reference Counting", "Cyclic GC", "Metaclasses", "Descriptors", "MRO (C3 Linearization)",
            "AsyncIO Event Loop", "Coroutines", "Multiprocessing", "Threading", "Context Managers",
            "__slots__", "Weak References", "Bytecode", "The dis module", "Monkey Patching",
            "Abstract Base Classes (ABC)", "Data Classes", "Walrus Operator"
        ],
        patterns: [
            "Singleton", "Factory", "Observer", "Strategy", "Decorator Pattern", "Adapter",
            "Dependency Injection", "Repository Pattern", "MVC", "Microservices"
        ]
    },
    react: {
        topics: [
            "Components", "Props", "State", "Events", "Forms", "Keys", "Refs",
            "Fragments", "JSX", "Virtual DOM", "Reconciliation", "Diffing Algorithm",
            "React.memo", "PureComponent", "Higher-Order Components (HOC)"
        ],
        advanced_topics: [
            "React Fiber", "Concurrent Mode", "Suspense", "Server Components (RSC)",
            "Hydration", "Progressive Hydration", "Selective Hydration", "Error Boundaries",
            "Portals", "Context API Performance", "Synthetic Events", "Batching",
            "useEffect Lifecycle", "useLayoutEffect vs useEffect", "Custom Hooks"
        ],
        patterns: [
            "Compound Components", "Render Props", "Controlled vs Uncontrolled",
            "Lift State Up", "Provider Pattern", "Container/Presentational",
            "Hooks Pattern", "Redux/Flux Architecture"
        ]
    },
    javascript: {
        topics: [
            "Variables", "Data Types", "Operators", "Functions", "Objects", "Arrays",
            "Loops", "Conditions", "DOM Manipulation", "Events", "JSON", "Prototypes",
            "Classes", "Modules (ES6)", "Promises", "Async/Await", "Callbacks"
        ],
        advanced_topics: [
            "Event Loop", "Microtask Queue", "Macrotask Queue", "Hoisting", "Closures",
            "Execution Context", "Lexical Environment", "This Binding", "Call/Apply/Bind",
            "Prototypal Inheritance", "WeakMap/WeakSet", "Proxy", "Reflect", "Generators",
            "Memory Leaks", "Garbage Collection (V8)", "JIT Compilation", "Strict Mode"
        ],
        patterns: [
            "Module Pattern", "Revealing Module Pattern", "Singleton", "Factory",
            "Observer", "Pub/Sub", "Prototype Pattern", "Middleware"
        ]
    }
};

const TEMPLATES = {
    theory: [
        "Explain the internal working of {topic} in {lang} in detail.",
        "How involves {topic} in {lang}?",
        "What are the performance implications of using {topic} in {lang}?",
        "Compare {topic} and {topic2} in {lang}.",
        "Why is {topic} considered a critical concept in {lang} development?",
        "Explain how {topic} relates to {advanced_topic} in {lang}.",
        "Discuss the best practices when working with {topic} in production {lang} apps.",
        "How does {lang} handle {advanced_topic} internally?",
        "What common pitfalls should developers avoid when using {topic}?",
        "Explain the evolution of {topic} in recent versions of {lang}."
    ],
    code: [
        "Write a {lang} script to demonstrate the use of {topic}.",
        "Implement a thread-safe usage of {advanced_topic} using {lang}.",
        "Refactor a piece of code that uses {topic} to use {topic2} instead.",
        "Write a {lang} function that leverages {advanced_topic} for optimization.",
        "Create a {patterns} implementation in {lang} from scratch.",
        "Demonstrate how to debug issues related to {advanced_topic} in {lang}.",
        "Write a unit test for a component/function handling {topic}.",
        "Implement a custom {topic} behavior using {advanced_topic}."
    ],
    teaching: [
        "How would you explain {advanced_topic} to a junior {lang} developer?",
        "Create a lesson plan for teaching {topic} to a non-technical stakeholder.",
        "Simplify the concept of {advanced_topic} using a real-world analogy.",
        "What are the prerequisites for understanding {advanced_topic} in {lang}?"
    ]
};

function getRandom(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getUniqueRandom(arr: string[], avoid: string): string {
    let item = getRandom(arr);
    let tries = 0;
    while (item === avoid && tries < 10) {
        item = getRandom(arr);
        tries++;
    }
    return item;
}

export function generateQuestions(
    categoryName: string,
    existingQuestions: string[],
    count: number,
    typeInstruction: string = "technical"
): string[] {
    const langKey = categoryName.toLowerCase();
    const bank = CONCEPTS[langKey] || CONCEPTS['python']; // Fallback to python if unknown, or generic

    const results: string[] = [];
    let attempts = 0;

    // Safety break
    while (results.length < count && attempts < count * 5) {
        attempts++;

        let templateList = TEMPLATES.theory;
        if (typeInstruction.includes('code')) templateList = TEMPLATES.code;
        if (typeInstruction.includes('teaching')) templateList = TEMPLATES.teaching;

        const template = getRandom(templateList);

        // Fill slots
        let question = template.replace(/{lang}/g, categoryName);

        // Topic slots
        const topic1 = getRandom([...bank.topics, ...bank.advanced_topics]);
        const topic2 = getUniqueRandom([...bank.topics, ...bank.advanced_topics], topic1);
        const adv = getRandom(bank.advanced_topics);
        const pattern = getRandom(bank.patterns);

        question = question.replace(/{topic}/g, topic1);
        question = question.replace(/{topic2}/g, topic2);
        question = question.replace(/{advanced_topic}/g, adv);
        question = question.replace(/{patterns}/g, pattern);

        if (!existingQuestions.includes(question) && !results.includes(question)) {
            results.push(question);
        }
    }

    // Fallback if strict uniqueness failed (rare with this combinatorics)
    while (results.length < count) {
        results.push(`Explore advanced concepts of ${categoryName} (generated backup ${results.length})`);
    }

    return results;
}

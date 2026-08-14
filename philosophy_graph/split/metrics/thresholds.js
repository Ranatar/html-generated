// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

const SYSTEMATIC_TYPES = ['presuppose', 'consequence', 'condition', 'exemplify',
      'instrument', 'culminate', 'mediate', 'apply', 'complement', 'emerge_from',
      'develop', 'synthesize'];

const DISRUPTIVE_TYPES = ['internal_contradiction', 'oppose'];

const CONSTRUCTIVE_TYPES = ['influence', 'develop', 'apply', 'synthesize',
      'instrument', 'exemplify', 'presuppose', 'consequence'];

const POLEMICAL_TYPES = ['critique', 'oppose', 'dialogue', 'limit',
      'internal_contradiction'];

const PHIL_SIM_MIN_CONCEPTS = 3;

const PHIL_SIM_MIN_RUBRIC_UNION = 3;

const GENERATIVITY_DAMPING = 0.85;

const GENERATIVITY_ITERATIONS = 40;

const BRIDGING_MIN_EXTERNAL = 5;

const BRIDGING_WEIGHT_REF = 50;

const METRIC_COVERAGE_WARN = 0.5;

export { BRIDGING_MIN_EXTERNAL, BRIDGING_WEIGHT_REF, CONSTRUCTIVE_TYPES, DISRUPTIVE_TYPES, GENERATIVITY_DAMPING, GENERATIVITY_ITERATIONS, METRIC_COVERAGE_WARN, PHIL_SIM_MIN_CONCEPTS, PHIL_SIM_MIN_RUBRIC_UNION, POLEMICAL_TYPES, SYSTEMATIC_TYPES };

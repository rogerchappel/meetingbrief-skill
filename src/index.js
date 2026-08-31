function asOptionalString(value, field, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string') throw new TypeError(field + ' must be a string.');
  return value.trim() || fallback;
}

function asList(value, field) {
  if (value === undefined || value === null || value === '') return [];
  const items = typeof value === 'string' ? [value] : value;
  if (!Array.isArray(items)) throw new TypeError(field + ' must be a string or an array of strings.');
  if (items.some((item) => typeof item !== 'string')) {
    throw new TypeError(field + ' must contain only strings.');
  }
  return items.map((item) => item.trim()).filter(Boolean);
}

function asSentence(value) {
  const closingDelimiter = String.raw`(?:["'’”\]\)}]|\s+\([^()]*\)|\s+\[[^\[\]]*\]|\s+\{[^{}]*\})`;
  return new RegExp(String.raw`[.!?]${closingDelimiter}*$`).test(value) ? value : value + '.';
}

function buildMeetingBrief(input) {
  if (input === null || Array.isArray(input) || typeof input !== 'object') {
    throw new TypeError('input must be an object.');
  }
  const title = asOptionalString(input.title, 'title', 'Untitled meeting');
  const date = asOptionalString(input.date, 'date', 'unscheduled');
  const attendees = asList(input.attendees, 'attendees');
  const goals = asList(input.goals, 'goals');
  const notes = asList(input.notes, 'notes');
  const questions = asList(input.questions, 'questions');
  const decisions = asList(input.recentDecisions, 'recentDecisions');
  const risks = [];
  if (!attendees.length) risks.push('No reliable attendee list provided.');
  if (!goals.length) risks.push('Meeting goals are missing or vague.');
  if (questions.length) risks.push('Open questions need owners before the meeting ends.');
  const agenda = [goals.length ? 'Confirm goals and desired decisions.' : 'Clarify the desired outcome.', notes.length ? 'Review relevant context notes.' : 'Collect missing context.', questions.length ? 'Assign owners for open questions.' : 'Capture new questions and decisions.', 'Close with explicit follow-up actions.'];
  return { title, date, attendees, goals, context: notes, recentDecisions: decisions, agenda, risks, followUpDraft: ['Thanks for the time today.', goals.length ? asSentence('Confirmed goals: ' + goals.join('; ')) : 'We clarified the intended outcome.', questions.length ? asSentence('Open questions: ' + questions.join('; ')) : 'No open questions were captured in the input.', 'Next steps should be assigned with owners and dates before sending.'] };
}

export { buildMeetingBrief };

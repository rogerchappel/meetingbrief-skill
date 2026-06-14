function asList(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

function buildMeetingBrief(input) {
  const attendees = asList(input.attendees);
  const goals = asList(input.goals);
  const notes = asList(input.notes);
  const questions = asList(input.questions);
  const decisions = asList(input.recentDecisions);
  const risks = [];
  if (!attendees.length) risks.push('No reliable attendee list provided.');
  if (!goals.length) risks.push('Meeting goals are missing or vague.');
  if (questions.length) risks.push('Open questions need owners before the meeting ends.');
  const agenda = [goals.length ? 'Confirm goals and desired decisions.' : 'Clarify the desired outcome.', notes.length ? 'Review relevant context notes.' : 'Collect missing context.', questions.length ? 'Assign owners for open questions.' : 'Capture new questions and decisions.', 'Close with explicit follow-up actions.'];
  return { title: input.title || 'Untitled meeting', date: input.date || 'unscheduled', attendees, goals, context: notes, recentDecisions: decisions, agenda, risks, followUpDraft: ['Thanks for the time today.', goals.length ? 'Confirmed goals: ' + goals.join('; ') + '.' : 'We clarified the intended outcome.', questions.length ? 'Open questions: ' + questions.join('; ') + '.' : 'No open questions were captured in the input.', 'Next steps should be assigned with owners and dates before sending.'] };
}

export { buildMeetingBrief };

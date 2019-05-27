import GraphQLLocalStrategy from './GraphQLLocalStrategy';

test('authenticate calls verify with username as default', () => {
  const verify = jest.fn();
  const strategy = new GraphQLLocalStrategy(verify);
  strategy.authenticate({}, { username: 'some-username', password: 'qwerty' });
  expect(verify).toHaveBeenCalled();
  expect(verify.mock.calls[0][0]).toBe('some-username');
  expect(verify.mock.calls[0][1]).toBe('qwerty');
  expect(typeof verify.mock.calls[0][2]).toBe('function');
});

test('authenticate calls verify with email if username is not provided', () => {
  const verify = jest.fn();
  const strategy = new GraphQLLocalStrategy(verify);
  strategy.authenticate({}, { email: 'max@mustermann.com', password: 'qwerty' });
  expect(verify).toHaveBeenCalled();
  expect(verify.mock.calls[0][0]).toBe('max@mustermann.com');
  expect(verify.mock.calls[0][1]).toBe('qwerty');
  expect(typeof verify.mock.calls[0][2]).toBe('function');
});

test('done callback calls strategy.success if user is provided', () => {
  const verify = jest.fn();
  const strategy = new GraphQLLocalStrategy(verify);
  strategy.success = jest.fn();
  strategy.authenticate({}, { email: 'max@mustermann.com', password: 'qwerty' });
  const done = verify.mock.calls[0][2];
  done(null, { email: 'max@mustermann.com' }, { info: true });
  expect(strategy.success).toHaveBeenCalledWith({ email: 'max@mustermann.com' }, { info: true });
});

test('done callback calls strategy.error if error is provided', () => {
  const verify = jest.fn();
  const strategy = new GraphQLLocalStrategy(verify);
  strategy.error = jest.fn();
  strategy.authenticate({}, { email: 'max@mustermann.com', password: 'qwerty' });
  const done = verify.mock.calls[0][2];
  done(new Error('some error'));
  expect(strategy.error).toHaveBeenCalledWith(new Error('some error'));
});

test('done callback calls strategy.fail with info if user is not provided', () => {
  const verify = jest.fn();
  const strategy = new GraphQLLocalStrategy(verify);
  strategy.fail = jest.fn();
  strategy.authenticate({}, { email: 'max@mustermann.com', password: 'qwerty' });
  const done = verify.mock.calls[0][2];
  done(null, null, { info: true });
  expect(strategy.fail).toHaveBeenCalledWith({ info: true });
});
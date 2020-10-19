import { Zero2nullPipe } from './zero2null.pipe';

describe('Zero2nullPipe', () => {
  it('create an instance', () => {
    const pipe = new Zero2nullPipe();
    expect(pipe).toBeTruthy();
  });
});

import { GitMatchPage } from './app.po';

describe('git-match App', () => {
  let page: GitMatchPage;

  beforeEach(() => {
    page = new GitMatchPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

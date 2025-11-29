export interface GithubConfig {
  pat: string;      // Personal Access Token
  owner: string;    // Repository owner
  repo: string;     // Repository name
  filePath: string; // Full path to the file in the repo
}

export interface GithubFileContent {
  sha: string;
}

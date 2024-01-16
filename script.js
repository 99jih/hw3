// DOM elements
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchUser");
const profileContainer = document.getElementById("profile");
const reposContainer = document.getElementById("repos");

// GitHub API 클래스
class GitHubAPI {
  constructor() {
    this.baseUrl = "https://api.github.com/users";
  }

  async getUser(username) {
    const profileResponse = await fetch(`${this.baseUrl}/${username}`);
    const reposResponse = await fetch(`${this.baseUrl}/${username}/repos`);
    const profile = await profileResponse.json();
    const repos = await reposResponse.json();
    return { profile, repos };
  }
}

// UI 클래스
class UI {
  showProfile(user) {
    const locationClass = user.location ? "" : "null-location";
    profileContainer.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2>${user.name ? user.name : user.login}</h2>
        </div>
        <div class="card-body">
          <div class="profile-info">
            <div class="avatar-info">
              <img src="${user.avatar_url}" alt="avatar" class="avatar">
              <ul class="info-list">
                <li>Followers: ${user.followers}</li>
                <li>Following: ${user.following}</li>
                <li>Repos: ${user.public_repos}</li>
                <li>Gists: ${user.public_gists}</li>
                <li class="${locationClass}">Location: ${user.location ? user.location : ""}</li>
              </ul>
            </div>
            <a href="${user.html_url}" target="_blank" class="view-profile-btn">View Profile</a>
          </div>
        </div>
      </div>
    `;
  }

  showRepos(repos) {
    let output = "<h2>Repositories</h2>";
    output += '<div class="repos-list">';
    repos.forEach((repo) => {
      output += `
        <div class="repo">
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          <span class="stars">Stars: ${repo.stargazers_count}</span>
          <span class="forks">Forks: ${repo.forks_count}</span>
        </div>
      `;
    });
    output += "</div>";
    reposContainer.innerHTML = output;
  }

  clearProfile() {
    profileContainer.innerHTML = "";
  }

  clearRepos() {
    reposContainer.innerHTML = "";
  }

  showAlert(message, className) {
    // Clear any remaining alerts
    this.clearAlert();
    const div = document.createElement("div");
    div.className = className;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".search");
    container.insertBefore(div, searchInput);

    // Timeout for alert
    setTimeout(() => {
      this.clearAlert();
    }, 3000);
  }

  clearAlert() {
    const currentAlert = document.querySelector(".alert");
    if (currentAlert) {
      currentAlert.remove();
    }
  }
}
// Event Listeners
searchButton.addEventListener("click", () => {
  const username = searchInput.value.trim();

  if (!username) {
    ui.showAlert("Please enter a username", "alert alert-danger");
  } else {
    github
      .getUser(username)
      .then((data) => {
        if (data.profile.message === "Not Found") {
          ui.showAlert("User not found", "alert alert-danger");
        } else {
          ui.showProfile(data.profile);
          ui.showRepos(data.repos);
        }
      })
      .catch((err) => {
        ui.showAlert(
          "There was a problem fetching the user data",
          "alert alert-danger"
        );
      });
  }
});

// Clear profile if the search box is cleared
searchInput.addEventListener("input", () => {
  if (!searchInput.value) {
    ui.clearProfile();
    ui.clearRepos();
  }
});

// Instantiate classes
const github = new GitHubAPI();
const ui = new UI();

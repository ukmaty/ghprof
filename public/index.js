const main = async function () {
  try {
    const userId = getUserId();
    const userInfo = await fetchUserInfo(userId);
    const view = createView(userInfo);
    displayView(view);
  }
  catch (error) {
    console.error(`error occured (${error})`);
  }
}

const fetchUserInfo = function (userId) {
  return fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(`${response.status}: ${response.statusText}`))
      } else {
        return response.json();
      }
    });
}

const getUserId = function () {
  return document.getElementById("userId").value;
}

function createView(userInfo) {
  return escapeHTML`
        <h4>${userInfo.name} (@${userInfo.login})</h4>
        <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
        <dl>
            <dt>Location</dt>
            <dd>${userInfo.location}</dd>
            <dt>Repositories</dt>
            <dd>${userInfo.public_repos}</dd>
        </dl>
        <a href="https://github.com/${userInfo.login}" target="_blank">take a look</a>
    `;
}

const displayView = function (view) {
  const result = document.getElementById("result");
  result.innerHTML = view;
}

const escapeSpecialChars = function (str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const escapeHTML = function (strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    if (typeof value === "string") {
      return result + escapeSpecialChars(value) + str;
    } else {
      return result + String(value) + str;
    }
  });
}

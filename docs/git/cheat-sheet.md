# Cheat Sheet

Skip the pre-commit hook
```shell
git commit -n
```

Rename local branch
```shell
git branch -m <old_name> <new_name>
```

Rename current local branch
```shell
git branch -m <new_name>
```

Rename local and remote branch
```shell
git branch -m <new_name>
git push origin --delete <old_name>
git push origin -u <new_name>
```

Change the remote origin's url
```shell
git remote set-url origin <new_url>
```

Set up identity
```shell
git config --global user.email "<user_email>"
git config --global user.name "<user_name>"
```
import subprocess
import os

def run_command(command):
    try:
        result = subprocess.run(command, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {command}")
        print(e.stderr)
        return None

def main():
    # Stage all files first to ensure we catch everything individually
    print("Staging all files to identify them...")
    run_command("git add .")
    
    # Get status of files
    # This will show 'A  file', 'M  file', 'D  file' etc. for everything including new files in subdirs
    status_output = run_command("git status --porcelain")
    
    # Unstage all files so we can commit them one by one
    print("Unstaging all files...")
    run_command("git reset")
    
    if not status_output:
        print("No changes to commit.")
        return

    files_to_commit = []
    lines = status_output.split('\n')
    
    for line in lines:
        if not line:
            continue
        # Status is first 2 chars, then space, then filename
        # porcelain v1: XY PATH
        parts = line[3:]
        # Remove quotes if present
        filename = parts.strip('"')
        files_to_commit.append(filename)

    print(f"Found {len(files_to_commit)} files to commit.")

    for i, filename in enumerate(files_to_commit):
        print(f"[{i+1}/{len(files_to_commit)}] Committing {filename}...")
        
        # Add file
        add_result = run_command(f'git add "{filename}"')
        
        # Commit file
        # Using filename as commit message
        commit_msg = f"Add {os.path.basename(filename)}"
        commit_result = run_command(f'git commit -m "{commit_msg}"')
        
        if commit_result is not None:
             # git commit returns 0 on success, subprocess.run raises if check=True
             # Our run_command catches error and prints it, returns None on error.
             # But valid commit output is string.
             print(f"Successfully committed {filename}")
        else:
             print(f"Failed to commit {filename}")

    print("All files processed.")
    
    # Push changes
    print("Pushing changes...")
    push_result = run_command("git push")
    if push_result is not None:
         print("Push successful!")
    else:
         print("Push failed.")

if __name__ == "__main__":
    main()

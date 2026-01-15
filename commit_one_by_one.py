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
    # Unstage all files first to ensure we start clean
    print("Unstaging all files...")
    run_command("git reset")

    # Get status of files
    status_output = run_command("git status --porcelain")
    
    if not status_output:
        print("No changes to commit.")
        return

    files_to_commit = []
    lines = status_output.split('\n')
    
    for line in lines:
        if not line:
            continue
        # Status is first 2 chars, then space, then filename
        # Ensure we handle filenames with spaces correctly if possible, 
        # though git status --porcelain might quote them.
        # Simple split might fail on spaces in filenames, but let's assume standard behavior or quoted.
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
        
        if commit_result:
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

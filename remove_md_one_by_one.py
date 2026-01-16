import subprocess
import os

def run_command(command):
    try:
        result = subprocess.run(command, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {command}")
        # print(e.stderr) # git rm might error if file not tracked, we handle that
        return None

def main():
    # Find all .md files excluding node_modules
    cmd = "find . -path ./node_modules -prune -o -name '*.md' -print"
    output = run_command(cmd)
    
    if not output:
        print("No .md files found.")
        return

    files = output.split('\n')
    # Filter out empty lines or the ./node_modules itself if it appears (prune usage usually behaves, but good to ensure)
    md_files = [f for f in files if f.endswith('.md') and 'node_modules' not in f]

    print(f"Found {len(md_files)} .md files to remove.")

    for i, filename in enumerate(md_files):
        print(f"[{i+1}/{len(md_files)}] Removing {filename}...")
        
        # git rm command
        # We use -f just in case, though standard git rm is fine. 
        # If file is not tracked, git rm fails. We should try git rm, if fail, just rm and git add (if we wanted to ensure removal)
        # But if it's not tracked, we just rm it.
        # Let's try git rm first.
        rm_result = run_command(f'git rm "{filename}"')
        
        if rm_result is None:
            # Maybe it wasn't tracked. Just delete it from fs.
            if os.path.exists(filename):
                os.remove(filename)
                print(f"Deleted untracked file {filename}")
            else:
                print(f"File {filename} not found (already deleted?)")
                continue
        
        # Commit
        commit_msg = f"Remove {os.path.basename(filename)}"
        commit_result = run_command(f'git commit -m "{commit_msg}"')
        
        if commit_result is not None:
             print(f"Successfully committed removal of {filename}")
        else:
             print(f"Failed to commit removal of {filename}")

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

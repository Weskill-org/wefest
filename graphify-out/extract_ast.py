import sys
import json
from graphify.extract import collect_files, extract
from pathlib import Path

def main():
    detect_path = Path('graphify-out/.graphify_detect.json')
    if not detect_path.exists():
        print("Detection file missing")
        sys.exit(1)
        
    detect = json.loads(detect_path.read_text(encoding='utf-8-sig'))
    code_files = []
    for f in detect.get('files', {}).get('code', []):
        p = Path(f)
        if p.is_dir():
            code_files.extend(collect_files(p))
        else:
            code_files.append(p)
            
    if code_files:
        result = extract(code_files, cache_root=Path('.'))
        Path('graphify-out/.graphify_ast.json').write_text(json.dumps(result, indent=2))
        print(f"AST: {len(result['nodes'])} nodes, {len(result['edges'])} edges")
    else:
        empty = {'nodes':[],'edges':[],'input_tokens':0,'output_tokens':0}
        Path('graphify-out/.graphify_ast.json').write_text(json.dumps(empty, indent=2))
        print('No code files - skipping AST extraction')

if __name__ == "__main__":
    main()

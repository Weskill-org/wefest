import sys
import json
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json
from pathlib import Path

def main():
    extraction_path = Path('graphify-out/.graphify_extract.json')
    detect_path = Path('graphify-out/.graphify_detect.json')
    
    extraction = json.loads(extraction_path.read_text(encoding='utf-8-sig'))
    detection  = json.loads(detect_path.read_text(encoding='utf-8-sig'))
    
    G = build_from_json(extraction)
    communities = cluster(G)
    cohesion = score_all(G, communities)
    tokens = {'input': extraction.get('input_tokens', 0), 'output': extraction.get('output_tokens', 0)}
    gods = god_nodes(G)
    surprises = surprising_connections(G, communities)
    
    # Human-defined labels
    labels = {
        "0": "Routing Infrastructure",
        "1": "Core UI Components & Shared Screens",
        "2": "Forms & Complex UI Logic",
        "3": "Main Layout & Navigation Context",
        "4": "Mobile Sidebar & Sheet UI",
        "5": "Organizer Dashboard & Recent Activity",
        "6": "Interactive Input Components",
        "7": "Data Viz & Navigation",
        "8": "Admin & Broadcast Systems",
        "9": "Menubar UI",
        "10": "Supabase Integration & Types",
        "11": "Carousel UI",
        "12": "Event Discovery & Lists",
        "13": "Organizer Layout & Profile",
        "14": "Chart Components",
        "15": "Context Menu UI",
        "16": "Command Palette UI",
        "17": "Alert Dialog UI",
        "18": "Table UI",
        "19": "Drawer UI",
        "20": "Breadcrumb UI",
        "21": "Navigation Menu UI",
        "22": "Blog & Content Management",
        "23": "Admin Analytics & Reporting",
        "24": "Student Dashboard & Experience",
        "25": "Toggle UI Components",
        "26": "Card Layout Components",
        "27": "Organizer Quick Actions",
        "28": "Alert UI Components",
        "29": "Accordion UI",
        "30": "Student Navigation Layout",
        "31": "Sponsor Pricing & Plans",
        "32": "Admin Layout & Links",
        "33": "Product Vision & Core Architecture",
        "34": "Maintenance & Debug Scripts",
        "35": "Performance Snapshot Logic",
        "36": "Terms & Legal Pages",
        "37": "Cookie Policy Page",
        "38": "Refund Policy Page",
        "39": "Admin Approvals Flow",
        "40": "College Directory Shell",
        "41": "Privacy Policy Page",
        "42": "Blog Layout Shell",
        "43": "Student Events Shell",
        "44": "Marketing & SEO Strategy",
        "45": "Event Status & Workflow Logic",
        "46": "ESLint Configuration",
        "47": "Vite Build Configuration",
        "48": "Aspect Ratio UI Utility",
        "49": "Collapsible UI Component",
        "50": "Monetization Strategy",
        "51": "Event Pass Feature Logic"
    }
    # Fill in any missing labels
    for cid in communities:
        if str(cid) not in labels:
            labels[str(cid)] = f'Community {cid}'
    
    questions = suggest_questions(G, communities, labels)
    
    report = generate(G, communities, cohesion, labels, gods, surprises, detection, tokens, '.', suggested_questions=questions)
    Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding='utf-8')
    to_json(G, communities, 'graphify-out/graph.json')
    
    analysis = {
        'communities': {str(k): v for k, v in communities.items()},
        'cohesion': {str(k): v for k, v in cohesion.items()},
        'gods': gods,
        'surprises': surprises,
        'questions': questions,
    }
    Path('graphify-out/.graphify_analysis.json').write_text(json.dumps(analysis, indent=2), encoding='utf-8')
    print(f'Graph: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges, {len(communities)} communities')

if __name__ == "__main__":
    main()

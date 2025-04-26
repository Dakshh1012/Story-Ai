from neo4j import GraphDatabase
from generate_story import generate_murder_mystery_story
from generate_pairs import extract_relationship_triples
from database import add_edge,add_node,connect_people,create_person
import json
# Replace with your Neo4j details
uri = "bolt://localhost:7687"
username = "neo4j"
password = "manishaJ1"

driver = GraphDatabase.driver(uri, auth=(username, password))
print("Connected to Neo4j database")

api_key="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"

story=generate_murder_mystery_story(api_key=api_key)

pairs=extract_relationship_triples(story,api_key=api_key)
story_data = {
    'story': story,
    'pairs': pairs
}

with open('stored_story.json', 'w', encoding='utf-8') as f:
    json.dump(story_data, f, ensure_ascii=False, indent=4)

print("Story and pairs saved to stored_story.json")
print(pairs)
import sys

uri = "bolt://localhost:7687"
username = "neo4j"
password = "manishaJ1"

driver = GraphDatabase.driver(uri, auth=(username, password))

def populate_neo4j_database(relationship_pairs):
    try:
        with driver.session() as session:
            # First create all nodes
            all_nodes = set()
            for source, _, target in relationship_pairs:
                all_nodes.add(source)
                all_nodes.add(target)
            
            # Create nodes with proper parameterization
            for node in all_nodes:
                # Determine labels
                labels = ["Person"]  # Default label
                if any(loc_word in node.lower() for loc_word in ['manor', 'ball', 'garden', 'study', 'laboratory']):
                    labels.append("Location")
                elif any(ev_word in node.lower() for ev_word in ['murder', 'gloves', 'fabric', 'note', 'phrase']):
                    labels.append("Evidence")
                
                # Add role labels
                if 'inspector' in node.lower():
                    labels.append("Investigator")
                elif 'professor' in node.lower():
                    labels.append("Professor")
                elif 'lady' in node.lower():
                    labels.append("Noble")
                
                # Create node with proper parameterization
                query = f"""
                MERGE (n:{':'.join(labels)} {{name: $name}})
                """
                session.run(query, name=node)
            
            # Create relationships
            for source, rel_type, target in relationship_pairs:
                rel_type = rel_type.upper().replace(' ', '_')
                query = """
                MATCH (a {name: $source}), (b {name: $target})
                MERGE (a)-[:%s]->(b)
                """ % rel_type
                session.run(query, source=source, target=target)
            
            print(f"Successfully added {len(all_nodes)} nodes and {len(relationship_pairs)} relationships")
            
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        raise
    finally:
        driver.close()


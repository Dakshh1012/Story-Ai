from neo4j import GraphDatabase

# Replace with your Neo4j details
uri = "bolt://localhost:7687"
username = "neo4j"
password = "manishaJ1"

driver = GraphDatabase.driver(uri, auth=(username, password))
print("Connected to Neo4j database")

# Function to add a node
def add_node(tx, name):
    tx.run("MERGE (p:Person {name: $name})", name=name)

def create_person(name):
    with driver.session() as session:
        session.execute_write(add_node, name)

# Function to add an edge with a relationship name
def add_edge(tx, name1, name2, relationship_name):
    tx.run("""
        MATCH (a:Person {name: $name1}), (b:Person {name: $name2})
        MERGE (a)-[r:RELATES_TO {type: $relationship_name}]->(b)
    """, name1=name1, name2=name2, relationship_name=relationship_name)

def connect_people(name1, name2, relationship_name):
    with driver.session() as session:
        session.execute_write(add_edge, name1, name2, relationship_name)

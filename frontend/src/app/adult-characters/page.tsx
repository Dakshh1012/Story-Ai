"use client";

import React, { useState } from "react";

interface Character {
  name: string;
  description: string;
}

interface StoryResult {
  status: string;
  story: string;
  elements_used: {
    characters: string[];
    locations: string[];
    evidence: string[];
  };
}

// Custom card components
const CustomCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);

const CustomCardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-1.5 p-6">
    {children}
  </div>
);

const CustomCardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-2xl font-semibold leading-none tracking-tight">
    {children}
  </h3>
);

const CustomCardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 pt-0">
    {children}
  </div>
);

export default function AdultCharactersPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StoryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateMystery = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use our own API endpoint instead of directly calling external API
      const response = await fetch('/api/generate-mystery', {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch mystery: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate mystery. Please try again.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Extract characters from the story with appropriate descriptions
  const extractCharacters = () => {
    if (!result) return [];
    
    // Filter out non-character entries that might be in the characters array
    const nonCharacterTerms = [
      "Kitchen", "Ancient Rituals", "Cryptic Message", "Others", 
      "Scent of Lavender", "Her Room", "Clue 2"
    ];
    
    const validCharacters = result.elements_used.characters.filter(
      name => !nonCharacterTerms.includes(name)
    );
    
    // Create descriptions based on story content
    return validCharacters.map(name => {
      let description = "Character in the mystery story";
      
      // Match characters with their descriptions from the story
      switch(name) {
        case "Professor James Winter":
          description = "An expert in ancient civilizations, revealed to be the killer";
          break;
        case "Detective Emily Windsor":
          description = "A keen-minded investigator who led the murder investigation";
          break;
        case "Mr. Edward Blackstone":
          description = "The enigmatic owner of Ravenwood Manor";
          break;
        case "Captain Reginald Fanshawe":
          description = "A decorated war hero, overheard arguing with the victim";
          break;
        case "Mrs. Vivienne LaRue":
          description = "A flamboyant actress seen sneaking around the gardens";
          break;
        case "Mr. Silas Markham":
          description = "A reclusive writer who acted suspiciously";
          break;
        case "Lady Victoria Waverley":
          description = "The murder victim, mistress of Ravenwood Manor";
          break;
        case "Professor Reginald Thistlewaite":
          description = "Academic rival of Professor Winter";
          break;
        case "Dr. Sophia Patel":
          description = "A brilliant forensic expert who examined the body";
          break;
        default:
          description = "Character in the mystery story";
      }
      
      return { name, description };
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Adult Mystery Generation</h1>
      
      <div className="flex justify-center mb-8">
        <button
          onClick={handleGenerateMystery}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="inline-block mr-2 h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
              Generating...
            </>
          ) : (
            "Generate Adult Mystery"
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Characters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {extractCharacters().map((character, index) => (
                <CustomCard key={index} className="shadow-md">
                  <CustomCardHeader>
                    <CustomCardTitle>{character.name}</CustomCardTitle>
                  </CustomCardHeader>
                  <CustomCardContent>
                    <p className="text-gray-600">{character.description}</p>
                  </CustomCardContent>
                </CustomCard>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Storyline</h2>
            <CustomCard className="shadow-md">
              <CustomCardContent>
                <div className="prose dark:prose-invert max-w-none">
                  {result.story.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </CustomCardContent>
            </CustomCard>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Locations</h2>
            <CustomCard className="shadow-md">
              <CustomCardContent>
                <ul className="list-disc pl-5">
                  {result.elements_used.locations.map((location, index) => (
                    <li key={index}>{location}</li>
                  ))}
                </ul>
              </CustomCardContent>
            </CustomCard>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Evidence</h2>
            <CustomCard className="shadow-md">
              <CustomCardContent>
                <ul className="list-disc pl-5">
                  {result.elements_used.evidence.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </CustomCardContent>
            </CustomCard>
          </div>
        </div>
      )}
    </div>
  );
}

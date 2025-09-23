export default async function fetchBoothVRChatItem(){
    const baseURL = "https://api.airtable.com/v0"
    const fullURL = [baseURL, process.env.AIRTABLE_BASE_ID, process.env.AIRTABLE_TABLE_NAME].join('/');

    
    try{

        const res = await fetch(fullURL, {
            method: "GET",
            headers:{
            'Authorization': 'Bearer '+ process.env.AIRTABLE_TOKEN,
            'Content-Type': 'application/json',
            }
        })

                
        if (!res.ok) throw new Error("Failed to fetch Airtable");

        const data = await res.json();

        return data;

    }catch(error){
        return error;
    }
}
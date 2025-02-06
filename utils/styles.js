import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  input: {
    height: 50,
    borderColor: '#dfe4ea',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  chart: {
    marginVertical: 20,
    borderRadius: 16
  },
    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      marginVertical: 5,
      backgroundColor: '#fff',
      borderRadius: 8,
    },
    categoryText: {
      fontSize: 16,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 20,
      color: '#95a5a6',
    },
    dateRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    summary: {
      marginTop: 20,
      alignItems: 'center',
      gap: 10,
    },
    dateText: {
      fontSize: 18, 
      fontWeight: 'bold',
      marginBottom: 16,    
    },
    label: {
      fontSize: 18, 
      fontWeight: 'bold',   
    },
    buttonStyle: {
      backgroundColor: '#7159c1',
      padding: 10,
      marginTop: 20,
      marginBottom: 20,
      borderRadius: 20,
    }    
});
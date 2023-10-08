import React, { useEffect, useState } from 'react'
import db from '../firebase';
import './PlansScreen.css'
import { addDoc, collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { loadStripe } from '@stripe/stripe-js';

function PlansScreen() {
    // Gets the products from firebase db
    const [products, setProducts] = useState([]);
    // Selects user from the selector
    const user = useSelector(selectUser);

    const [ subscription, setSubscription ] = useState(null);

    useEffect(() => {
        const fetchSubscription = async () => {
          if (user?.uid) {
            const userDocRef = doc(db, 'customers', user.uid);
            const subscriptionsCollectionRef = collection(userDocRef, 'subscriptions');
            const subscriptionsQuery = query(subscriptionsCollectionRef);
    
            try {
              const querySnapshot = await getDocs(subscriptionsQuery);
    
              querySnapshot.forEach((subscriptionDoc) => {
                const subscriptionData = subscriptionDoc.data();
                setSubscription({
                  role: subscriptionData.role,
                  current_period_end: subscriptionData.current_period_end.seconds,
                  current_period_start: subscriptionData.current_period_start.seconds,
                });
              });
            } catch (error) {
              console.error('Error fetching subscriptions', error);
            }
          }
        };
    
        fetchSubscription();
      }, [user.uid]);

    //fetches the products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                //creates a query object where active is true
                const q = query(collection(db, 'products'), where('active', '==', true));
                //fetches documents that matches the query
                const querySnapshot = await getDocs(q);

                //Map over the query results to extract product data and prices
                const productsData = querySnapshot.docs.map(async (doc)=> {
                    // extract the product data
                    const productData = doc.data();

                    //Fetch prices for the product
                    const priceQuerySnapshot = await getDocs(collection(doc.ref, 'prices'));

                    // Map over the price query results to extract price data
                    const prices = priceQuerySnapshot.docs.map((priceDoc) => {
                        return {
                            priceId: priceDoc.id,
                            priceData: priceDoc.data(),
                        };
                    });

                    return {
                        //combine product data and prices
                        ...productData,
                        prices,
                    };
                });

                //Update the statw with the retrieved products data
                setProducts(await Promise.all(productsData));
            } catch (error) {
                console.error('Error fetching products', error);
            }
        }

        //Call the fetchProducts function to retrieve Data
        fetchProducts();

    }, [])

    console.log(products);

    // Loads checkout and redirects users
    const loadCheckout = async (priceId) => {
        const customerDocRef = doc(db, 'customers', user.uid);
        const checkoutSessionCollection = collection(customerDocRef, "checkout_sessions")

        const docRef = await addDoc(checkoutSessionCollection, {
            price: priceId,
            success_url: window.location.origin,
            cancel_url: window.location.origin,
        })

        //creates a listener for changes in the data 
        const unsubscribe = onSnapshot(docRef, async (snap) => {
            // Deconstrutor to see if we have an error or a session
            const { error, sessionId } = snap.data();

            if (error) {
                // Shows an error to the user
                // Inspects the cloud function logs in the Firebase Console
                alert(`An error occured: ${error.message}`);
            }

            if (sessionId) {
                // We have a checkout Session and we need to redirect to checkout
                // Init Stripe
                const stripe = await loadStripe('pk_test_51NxOhbFjXal3yEYvYwMms60ApoSUwgM8pRahb7OwrB3j8dXcnlBoGXlcxPwrV4mYcaGCzEDfgz1XNv4fx1dzjSh000GBvS2Ut9');

                //redirects to checkout
                stripe.redirectToCheckout({sessionId})
            }
        })

        unsubscribe();
    };

  return (
    <div className="plansScreen">
        <br />
        {subscription && (
            <p>
                Renewal Date: {new Date(subscription?.current_period_end * 1000)
                .toLocaleDateString()}
            </p>
        )}
        {/* Maps through the object and renders plans */}
        {Object.entries(products).map(([productId, productData]) => {
            //TODO Logic to check if the user subs is active
            const isCurrentPlan = productData.name
            ?.toLowerCase()
            .includes(subscription?.role);

            return (
                <div 
                    key={productId} 
                    className={`${isCurrentPlan && "planScreen__plan--disabled"} plansScreen__plan`}>
                    <div className="planScreen__info">
                        <h5>{productData.name}</h5>
                        <h4>{productData.description}</h4>
                    </div>

                    <button onClick={() => loadCheckout(productData.prices[0].priceId)}>
                        {isCurrentPlan ? "Current Plan" : "Subscribe"}
                    </button>
                </div>
            )
        })
    }
    </div>
  )
}

export default PlansScreen;
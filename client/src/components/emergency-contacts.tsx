import { Button } from "@/components/ui/button";
import type { EmergencyContact } from "@shared/schema";

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  isLoading: boolean;
}

export default function EmergencyContacts({ contacts, isLoading }: EmergencyContactsProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "danger":
        return {
          bg: "bg-red-100",
          icon: "text-red-500",
          button: "bg-red-500 hover:bg-red-600",
        };
      case "water":
        return {
          bg: "bg-blue-100",
          icon: "text-blue-500",
          button: "bg-blue-500 hover:bg-blue-600",
        };
      case "success":
        return {
          bg: "bg-green-100",
          icon: "text-green-500",
          button: "bg-green-500 hover:bg-green-600",
        };
      case "warning":
        return {
          bg: "bg-orange-100",
          icon: "text-orange-500",
          button: "bg-orange-500 hover:bg-orange-600",
        };
      default:
        return {
          bg: "bg-gray-100",
          icon: "text-gray-500",
          button: "bg-gray-500 hover:bg-gray-600",
        };
    }
  };

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleSpecialAction = (contact: EmergencyContact) => {
    if (contact.name === "Emergency Alert System") {
      // Open SMS signup or alert subscription
      window.open("sms:12345?body=SUBSCRIBE FLOOD ALERTS", "_blank");
    } else if (contact.name === "Community Updates") {
      // Open Facebook group
      window.open("https://facebook.com/groups/floodwatch", "_blank");
    } else {
      handleCall(contact.phoneNumber);
    }
  };

  const getButtonText = (contact: EmergencyContact) => {
    if (contact.name === "Emergency Alert System") {
      return (
        <>
          <i className="fas fa-envelope mr-2"></i>
          Subscribe to Alerts
        </>
      );
    } else if (contact.name === "Community Updates") {
      return (
        <>
          <i className="fab fa-facebook mr-2"></i>
          Join Group
        </>
      );
    } else {
      return (
        <>
          <i className="fas fa-phone mr-2"></i>
          Call {contact.phoneNumber}
        </>
      );
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
        <i className="fas fa-phone text-red-500"></i>
        <span>Emergency Contacts</span>
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => {
            const colors = getColorClasses(contact.color);
            return (
              <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center`}>
                    <i className={`${contact.icon} ${colors.icon} text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.description}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSpecialAction(contact)}
                  className={`w-full ${colors.button} text-white font-semibold transition-colors`}
                >
                  {getButtonText(contact)}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

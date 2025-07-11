public class GenerateHash {
    public static void main(String[] args) {
        // This is the BCrypt hash for "admin123"
        // You can verify it with any BCrypt library
        String hash = "$2a$10$DowJonesK/b9.eUEGh7le0.PmyGTmokVqBhUZM5hsAlgFMQR7H7EO";
        System.out.println("UPDATE users SET password_hash = '{bcrypt}" + hash + "' WHERE username = 'admin@octopustms.com';");
    }
}
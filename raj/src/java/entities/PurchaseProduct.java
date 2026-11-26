/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package entities;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;


/**
 *
 * @author Jairubre
 */
@Entity
@Table(name = "purchase_product")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "PurchaseProduct.findAll", query = "SELECT p FROM PurchaseProduct p"),
    @NamedQuery(name = "PurchaseProduct.findByPurchaseId", query = "SELECT p FROM PurchaseProduct p WHERE p.purchaseProductPK.purchaseId = :purchaseId"),
    @NamedQuery(name = "PurchaseProduct.findByProductId", query = "SELECT p FROM PurchaseProduct p WHERE p.purchaseProductPK.productId = :productId"),
    @NamedQuery(name = "PurchaseProduct.findByQuantity", query = "SELECT p FROM PurchaseProduct p WHERE p.quantity = :quantity")})
public class PurchaseProduct implements Serializable {

    private static final long serialVersionUID = 1L;
    @EmbeddedId
    protected PurchaseProductPK purchaseProductPK;
    @Basic(optional = false)
    @NotNull
    @Column(name = "quantity")
    private int quantity;
    @JoinColumn(name = "product_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Product product;
    @JoinColumn(name = "purchase_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Purchase purchase;

    public PurchaseProduct() {
    }

    public PurchaseProduct(PurchaseProductPK purchaseProductPK) {
        this.purchaseProductPK = purchaseProductPK;
    }

    public PurchaseProduct(PurchaseProductPK purchaseProductPK, int quantity) {
        this.purchaseProductPK = purchaseProductPK;
        this.quantity = quantity;
        
    }

    public PurchaseProduct(long purchaseId, long productId) {
        this.purchaseProductPK = new PurchaseProductPK(purchaseId, productId);
    }

    public PurchaseProductPK getPurchaseProductPK() {
        return purchaseProductPK;
    }

    public void setPurchaseProductPK(PurchaseProductPK purchaseProductPK) {
        this.purchaseProductPK = purchaseProductPK;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

   

   

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Purchase getPurchase() {
        return purchase;
    }

    public void setPurchase(Purchase purchase) {
        this.purchase = purchase;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (purchaseProductPK != null ? purchaseProductPK.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof PurchaseProduct)) {
            return false;
        }
        PurchaseProduct other = (PurchaseProduct) object;
        if ((this.purchaseProductPK == null && other.purchaseProductPK != null) || (this.purchaseProductPK != null && !this.purchaseProductPK.equals(other.purchaseProductPK))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entities.PurchaseProduct[ purchaseProductPK=" + purchaseProductPK + " ]";
    }
    
}
